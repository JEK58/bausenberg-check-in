<template>
  <div class="container-fluid h-100 pt-4">
    <div class="col-12 col-sm-10 col-md-8 col-xl-6 mx-auto full-height">
      <!-- Check-in -->
      <div v-if="!checkInId && showThankYou == false">
        <h4>Bausenberg Check-in</h4>
        <div class="row mt-4">
          <div class="col-12">
            <input
              type="text"
              class="form-control col"
              id="name"
              placeholder="Voller Name"
              :value="name"
              @input="(evt) => (name = evt.target.value)"
            />
          </div>

          <div class="btn-group mt-2 col-12" role="group">
            <input
              type="radio"
              class="btn-check"
              name="btnradioclub"
              id="btn-rml"
              value="RML"
              v-model="club"
            />
            <label class="btn btn-outline-secondary" for="btn-rml">RML</label>

            <input
              type="radio"
              class="btn-check"
              name="btnradioclub"
              id="btn-dgc"
              value="DGC"
              v-model="club"
            />
            <label class="btn btn-outline-secondary" for="btn-dgc">DGC</label>
          </div>
        </div>
        <div class="mt-5 mb-5">
          <div class="my-2 d-grid gap-2">
            <button
              type="button"
              class="btn btn-lg btn-danger"
              @click="addCheckIn"
              :disabled="!checkInButtonIsActive"
            >
              Check In
              <div
                v-if="showSpinner"
                class="spinner-border spinner-border-sm"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
            <!-- Errors -->
            <div v-if="showTooManyRequestsWarning" class="mt-4 text-warning">
              Du scheinst zu viele Flüge in zu kurzer Zeit melden zu wollen.
              Bitte warte noch {{ apiRateLimitCountDown }} Minuten.
            </div>
            <div v-if="showConnectionError" class="mt-4 text-warning">
              Verbindung nicht möglich - vielleicht hast du gerade schlechten
              Empfang? Im Zweifel versuche es noch mal.
            </div>
          </div>
        </div>
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
      </div>
      <!-- Checkout -->
      <div v-if="checkInId && showThankYou == false">
        <h4>Bausenberg Check-out</h4>
        <div class="d-grid gap-2">
          <div class="btn-group-vertical btn-group-lg col mt-4" role="group">
            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btn-regular-landing"
              value="Landewiese"
              v-model="landing"
            />
            <label
              class="btn btn-outline-secondary text-start"
              for="btn-regular-landing"
              >Landewiese 👌</label
            >

            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btn-alternate-landing"
              value="Notlandewiese"
              v-model="landing"
            />
            <label
              class="btn btn-outline-secondary text-start"
              for="btn-alternate-landing"
              >Notlandewiese 🧐</label
            >
            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btn-xc-landing"
              Doch
              nicht
              gestartet
              value="Streckenflug"
              v-model="landing"
            />
            <label
              class="btn btn-outline-secondary text-start"
              for="btn-xc-landing"
              >Streckenflug 🎉</label
            >
            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btn-no-takeoff"
              value="Doch nicht gestartet"
              v-model="landing"
            />
            <label
              class="btn btn-outline-secondary text-start"
              for="btn-no-takeoff"
              >Doch nicht gestartet 🤷</label
            >
          </div>
        </div>

        <div class="my-5">
          <div class="my-2 d-grid gap-2">
            <button
              type="button"
              class="btn btn-lg btn-success"
              @click="addCheckOut"
              :disabled="checkoutButtonIsDisabled"
            >
              Check out
              <div
                v-if="showSpinner"
                class="spinner-border spinner-border-sm"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <!-- Finish -->
      <div v-if="showThankYou">
        <h4>Danke!</h4>
        <div class="my-3">
          <p>
            Du kannst das Fenster nun schließen oder einen weiteren Flug
            eintragen.
          </p>

          <div class="my-2 d-grid gap-2">
            <button type="button" class="btn btn-success" @click="resetApp">
              Neuer Flugbucheintrag
            </button>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="mt-5">
        <p>
          <a href="https://www.thermik4u.de/index.php/impressum">Datenschutz</a>
          ·
          <a href="https://www.thermik4u.de/index.php/disclaimer">Impressum</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import API from "@/services/API";
import { format } from "date-fns";

export default {
  name: "Home",
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
};
</script>

<style scoped>
html,
body {
  height: 100vh;
}

.full-height {
  height: 100vh;
}
/* a {
  text-decoration: none;
  color: steelblue;
} */
</style>
