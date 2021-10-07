<template>
  <div class="container-fluid bg-dark h-100 pt-4 text-light">
    <div class="col-11 col-sm-10 col-xl-6 mx-auto full-height">
      <!-- Check-in -->
      <div v-if="!checkInId">
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
        <div class="my-3">
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
        <h6>Hinweis:</h6>
        <p>
          Nach dem Flug bitte wieder auschecken und die genutzte Landewiese
          angeben.
        </p>
      </div>
      <!-- Checkout -->
      <div v-else>
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
            value="Woanders"
            v-model="landing"
          />
          <label class="btn btn-outline-light" for="btn-xc-landing"
            >Ganz woanders 🥳 🚀</label
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
    };
  },
  methods: {
    async addCheckIn() {
      const response = await API.addCheckIn({
        name: this.name,
        club: this.club,
      });
      console.log(response);
      if (response.status === 201) this.checkInId = response.data._id;
    },
    async addCheckOut() {
      const response = await API.addCheckOut(this.checkInId, {
        landing: this.landing,
      });
      console.log(response);
      if (response.status === 201) {
        this.checkInId = null;
        this.landing = null;
      }
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
};
</script>

<style>
html,
body {
  height: 100vh;
}

.full-height {
  height: 100vh;
}
</style>
