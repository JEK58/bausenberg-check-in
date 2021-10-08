<template>
  <div class="container-fluid bg-dark h-100 pt-4 text-light">
    <div class="col-11 col-sm-10 col-xl-6 mx-auto full-height">
      <!-- Check-in -->
      <div v-if="!checkInId && showThankYou == false">
        <h4>Bausenberg Check-in</h4>
        <div class="row ms-0 mt-4">
          <input
            type="text"
            class="form-control col"
            id="name"
            placeholder="Name"
            v-model="name"
          />
          <div class="btn-group col" role="group">
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
              :disabled="checkInButtonIsDisabled"
            >
              Check In
            </button>
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
        <div class="btn-group col mt-4" role="group">
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btn-regular-landing"
            value="Landewiese"
            v-model="landing"
          />
          <label class="btn btn-outline-light" for="btn-regular-landing"
            >Landewiese</label
          >

          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btn-alternate-landing"
            value="Notlandewiese"
            v-model="landing"
          />
          <label class="btn btn-outline-light" for="btn-alternate-landing"
            >Notlandewiese</label
          >
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btn-xc-landing"
            value="Außenlandung"
            v-model="landing"
          />
          <label class="btn btn-outline-light" for="btn-xc-landing"
            >Außenlandung</label
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
            Du kannst das Fenster nun schließen, oder einen weiteren Flug
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
    };
  },
  methods: {
    async addCheckIn() {
      const response = await API.addCheckIn({
        name: this.name,
        club: this.club,
      });
      if (response.status === 201) {
        this.checkInId = response.data._id;
        this.saveIdToLocalStorage(response.data._id, response.data.checkInDate);
        return;
      }
      console.log(response);
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
    },
  },
  computed: {
    checkInButtonIsDisabled() {
      return !(this.name.length > 8 && this.club);
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
