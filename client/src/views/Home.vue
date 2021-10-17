<template>
  <div class="container-fluid bg-dark h-100 pt-4 text-light">
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
            <label class="btn btn-outline-light" for="btn-rml">RML</label>

            <input
              type="radio"
              class="btn-check"
              name="btnradioclub"
              id="btn-dgc"
              value="DGC"
              v-model="club"
            />
            <label class="btn btn-outline-light" for="btn-dgc">DGC</label>
          </div>
        </div>
        <div class="mt-3 mb-5">
          <div class="my-2 d-grid gap-2">
            <button
              type="button"
              class="btn btn-danger"
              @click="addCheckIn"
              :disabled="!checkInButtonIsActive"
            >
              Check In
            </button>
            <div v-if="showTooManyRequestsWarning" class="mt-4 text-warning">
              Du scheinst zu viele Flüge in zu kurzer Zeit melden zu wollen.
            </div>
          </div>
          <div v-if="showDebug">
            <h4>Debug</h4>
            checkInButtonIsActive: {{ checkInButtonIsActive }} <br />
            name value:
            {{ name }}
          </div>
        </div>
        <h5>Hinweis:</h5>
        <p>
          Nach dem Flug bitte wieder auschecken und die genutzte Landewiese
          angeben. <br />Für jeden Flug muss ein Eintrag erstellt werden, auch
          wenn dieser am selben Tag stattfindet.
        </p>
        <p>
          Bei Problemen schicke bitte eine Mail an
          <a href="mailto:email@example.com?subject=Bausenberg Check-in"
            >email@example.com</a
          >
        </p>
      </div>
      <!-- Checkout -->
      <div v-if="checkInId && showThankYou == false">
        <h4>Bausenberg Check-out</h4>
        <div class="btn-group-vertical col mt-4" role="group">
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btn-regular-landing"
            value="Landewiese"
            v-model="landing"
          />
          <label
            class="btn btn-outline-light text-start"
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
            class="btn btn-outline-light text-start"
            for="btn-alternate-landing"
            >Notlandewiese 🧐</label
          >
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btn-xc-landing"
            value="Außenlandung"
            v-model="landing"
          />
          <label class="btn btn-outline-light text-start" for="btn-xc-landing"
            >Außenlandung 🎉</label
          >
        </div>
        <div class="my-3">
          <div class="my-2 d-grid gap-2">
            <button
              type="button"
              class="btn btn-success"
              @click="addCheckOut"
              :disabled="checkoutButtonIsDisabled"
            >
              Check out
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
    </div>
  </div>
</template>

<script>
import API from "@/services/API";

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
    };
  },
  methods: {
    async addCheckIn() {
      try {
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
          return;
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 429) {
          this.showTooManyRequestsWarning = true;
          console.log(error.response.data);
          return;
        }
      }
    },
    async addCheckOut() {
      const response = await API.addCheckOut(this.checkInId, {
        landing: this.landing,
      });
      if (response.status === 201) {
        this.showThankYou = true;
        this.removeIdFromLocalStorage();
        return;
      }
      console.log(response);
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
    },
  },
  computed: {
    checkInButtonIsActive() {
      const regex = /\w{3,} \w{3,}/;
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
a {
  text-decoration: none;
  color: steelblue;
}
</style>
