<template>
  <main class="container">
    <!-- Check-in -->
    <div v-if="!checkInId && showThankYou == false">
      <h4>Bausenberg Check-in</h4>
      <section>
        <input
          id="name"
          type="text"
          placeholder="Voller Name"
          :value="name"
          @input="(evt) => (name = evt.target.value)"
        />

        <input
          id="btn-rml"
          v-model="club"
          type="radio"
          name="btnradioclub"
          value="RML"
        />
        <label class="" for="btn-rml">RML</label>

        <input
          id="btn-dgc"
          v-model="club"
          type="radio"
          class=""
          name="btnradioclub"
          value="DGC"
        />
        <label class="" for="btn-dgc">DGC</label>
      </section>
      <section>
        <button
          :disabled="!checkInButtonIsActive"
          :aria-busy="showSpinner"
          @click="addCheckIn"
        >
          Check In
        </button>
        <!-- Errors -->
        <div v-if="showTooManyRequestsWarning" class="">
          Du scheinst zu viele Flüge in zu kurzer Zeit melden zu wollen. Bitte
          warte noch {{ apiRateLimitCountDown }} Minuten.
        </div>
        <div v-if="showConnectionError" class="">
          Verbindung nicht möglich - vielleicht hast du gerade schlechten
          Empfang? Im Zweifel versuche es noch mal.
        </div>
      </section>
      <section>
        <h5>Hinweis:</h5>
        <p>
          Nach dem Flug bitte wieder auschecken und die genutzte Landewiese
          angeben. <br />Für jeden Flug muss ein Eintrag erstellt werden - auch
          wenn dieser am selben Tag stattfindet.
        </p>
        <p>
          Bei Problemen schicke bitte eine Mail an
          <a href="mailto:bausenberg@thermik4u.de?subject=Bausenberg Check-in"
            >bausenberg@thermik4u.de</a
          >
        </p>
        <p>
          <strong
            ><a href="https://www.thermik4u.de/fluggebiete/niederzissen"
              >Hinweise zum Fluggebiet</a
            ></strong
          >
        </p>
      </section>
    </div>
    <!-- Checkout -->
    <div v-if="checkInId && showThankYou == false">
      <h4>Bausenberg Check-out</h4>
      <fieldset>
        <label for="btn-regular-landing">
          <input
            id="btn-regular-landing"
            v-model="landing"
            type="radio"
            name="btnradio"
            value="Landewiese"
          />
          Landewiese 👌
        </label>

        <label for="btn-alternate-landing">
          <input
            id="btn-alternate-landing"
            v-model="landing"
            type="radio"
            name="btnradio"
            value="Notlandewiese"
          />
          Notlandewiese 🧐
        </label>

        <label for="btn-xc-landing">
          <input
            id="btn-xc-landing"
            v-model="landing"
            type="radio"
            name="btnradio"
            value="Streckenflug"
          />
          Streckenflug 🎉
        </label>

        <label for="btn-no-takeoff">
          <input
            id="btn-no-takeoff"
            v-model="landing"
            type="radio"
            name="btnradio"
            value="Doch nicht gestartet"
          />
          Doch nicht gestartet 🤷
        </label>
      </fieldset>

      <button
        :disabled="checkoutButtonIsDisabled"
        :aria-busy="showSpinner"
        @click="addCheckOut"
      >
        Check out
      </button>
    </div>

    <!-- Finish -->
    <div v-if="showThankYou">
      <section>
        <h4>Danke!</h4>
        <p>
          Du kannst das Fenster nun schließen oder einen weiteren Flug
          eintragen.
        </p>

        <button @click="resetApp">Neuer Flugbucheintrag</button>
      </section>
    </div>
    <!-- Footer -->
    <footer>
      <p>
        <a href="https://www.thermik4u.de/index.php/impressum">Datenschutz</a>
        ·
        <a href="https://www.thermik4u.de/index.php/disclaimer">Impressum</a>
      </p>
    </footer>
  </main>
</template>

<script>
import API from "@/services/API";

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      name: "",
      club: null,
      landing: null,
      checkInId: null,
      showThankYou: false,
      showDebug: false,
      showTooManyRequestsWarning: false,
      showSpinner: false,
      showConnectionError: false,
      apiRateLimitCountDown: import.meta.env.VITE_API_RATE_LIMIT,
    };
  },

  computed: {
    checkInButtonIsActive() {
      const regex = /(\w|[üäöÄÜÖß-]){3,} (\w|[üäöÄÜÖß-]){3,}/;
      if (this.name.match(regex) && this.club) return true;
      return false;
    },
    checkoutButtonIsDisabled() {
      return !this.landing;
    },
  },
  created() {
    this.getIdFromLocalStorage();
  },
  methods: {
    async addCheckIn() {
      try {
        this.showSpinner = true;
        const response = await API.addCheckIn({
          name: this.name,
          club: this.club,
        });
        if (response.status === 201) {
          this.checkInId = response.data._id;
          this.saveIdToLocalStorage(
            response.data._id,
            response.data.checkInDate
          );
          this.showSpinner = false;
          this.showConnectionError = false;

          return;
        }
      } catch (error) {
        if (!error.response) {
          this.showConnectionError = true;
          this.showSpinner = false;
          return;
        }
        if (error.response?.status === 429) {
          this.showTooManyRequestsWarning = true;
          this.showSpinner = false;
          return;
        }
      }
    },
    async addCheckOut() {
      try {
        this.showSpinner = true;

        const response = await API.addCheckOut(this.checkInId, {
          landing: this.landing,
        });
        if (response.status === 201) {
          this.showThankYou = true;
          this.removeIdFromLocalStorage();
          this.showSpinner = false;
          this.showConnectionError = false;
          return;
        }
        console.log(response);
      } catch (error) {
        console.log(error);
        this.showConnectionError = true;
        if (error.response.status === 400) {
          // Escape if there is something wrong with the server.
          // User doesn't care. Dirty but good enough.
          this.showThankYou = true;
          this.removeIdFromLocalStorage();
          this.showSpinner = false;

          return;
        }
      }
    },
    saveIdToLocalStorage(id, checkInDate) {
      localStorage.setItem(
        "check-in-id",
        JSON.stringify({
          id: id,
          date: checkInDate,
        })
      );
    },
    getIdFromLocalStorage() {
      if (localStorage.getItem("check-in-id") === null) return;

      const { id } = JSON.parse(localStorage.getItem("check-in-id"));
      this.checkInId = id;
    },

    removeIdFromLocalStorage() {
      localStorage.removeItem("check-in-id");
    },

    resetApp() {
      this.checkInId = null;
      this.landing = null;
      this.showThankYou = false;
      this.showTooManyRequestsWarning = false;
      this.showSpinner = false;
      this.showConnectionError = false;
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100vh;
}
</style>
