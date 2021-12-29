<template>
  <main class="container">
    <!-- Check-in -->
    <div v-if="!checkInId && showThankYou == false">
      <h3>Bausenberg Check-in</h3>

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
        <label for="btn-rml">RML</label>

        <input
          id="btn-dgc"
          v-model="club"
          type="radio"
          name="btnradioclub"
          value="DGC"
        />
        <label for="btn-dgc">DGC</label>
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
        <div v-if="showTooManyRequestsWarning" class="warning">
          Du scheinst zu viele Flüge in zu kurzer Zeit melden zu wollen. Bitte
          warte noch {{ apiRateLimitCountDown }} Minuten.
        </div>
        <div v-if="showConnectionError" class="warning">
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
          <a href="mailto:bausenberg@thermik4u.de?subject=Bausenberg Check-in">
            bausenberg@thermik4u.de
          </a>
        </p>
        <p>
          <strong
            ><a
              href="https://www.thermik4u.de/fluggebiete/niederzissen"
              target="_blank"
            >
              Hinweise zum Fluggebiet
            </a>
          </strong>
        </p>
      </section>
    </div>
    <!-- Checkout -->
    <div v-if="checkInId && showThankYou == false">
      <h3>Bausenberg Check-out</h3>
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
      <div v-if="showConnectionError" class="warning">
        Verbindung nicht möglich - vielleicht hast du gerade schlechten Empfang?
        Im Zweifel versuche es noch mal.
      </div>
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
  </main>
  <!-- Footer -->
  <footer class="container">
    <p>
      <a href="https://www.thermik4u.de/index.php/impressum" target="_blank"
        >Impressum</a
      >
      ·
      <a href="https://www.thermik4u.de/index.php/disclaimer" target="_blank"
        >Datenschutz</a
      >
    </p>
  </footer>
</template>

<script setup>
import API from "@/services/API";
import { ref, computed, onBeforeMount } from "vue";

const name = ref("");
const club = ref(null);
const landing = ref(null);
const checkInId = ref(null);
const showThankYou = ref(false);
const showTooManyRequestsWarning = ref(false);
const showSpinner = ref(false);
const showConnectionError = ref(false);

const apiRateLimitCountDown = import.meta.env.VITE_API_RATE_LIMIT;

const checkInButtonIsActive = computed(() => {
  const regex = /(\w|[üäöÄÜÖß-]){3,} (\w|[üäöÄÜÖß-]){3,}/;
  if (name.value.match(regex) && club.value) return true;
  return false;
});
const checkoutButtonIsDisabled = computed(() => {
  return !landing.value;
});

onBeforeMount(() => getIdFromLocalStorage());

const addCheckIn = async () => {
  try {
    showSpinner.value = true;
    const response = await API.addCheckIn({
      name: name.value,
      club: club.value,
    });
    if (response.status === 201) {
      checkInId.value = response.data._id;
      saveIdToLocalStorage(response.data._id, response.data.checkInDate);
      showSpinner.value = false;
      showConnectionError.value = false;

      return;
    }
  } catch (error) {
    if (!error.response) {
      showConnectionError.value = true;
      showSpinner.value = false;
      return;
    }
    if (error.response?.status === 429) {
      showTooManyRequestsWarning.value = true;
      showSpinner.value = false;
      return;
    }
  }
};

const addCheckOut = async () => {
  try {
    showSpinner.value = true;

    const response = await API.addCheckOut(checkInId.value, {
      landing: landing.value,
    });
    if (response.status === 201) {
      showThankYou.value = true;
      removeIdFromLocalStorage();
      showSpinner.value = false;
      showConnectionError.value = false;
      return;
    }
    console.log(response);
  } catch (error) {
    console.log(error);
    showConnectionError.value = true;
    if (error?.response?.status === 400) {
      // Escape if there is something wrong with the server.
      // User doesn't care. Dirty but good enough.
      showThankYou.value = true;
      removeIdFromLocalStorage();
      showSpinner.value = false;

      return;
    }
    if (!error.response) {
      showConnectionError.value = true;
      showSpinner.value = false;
      return;
    }
  }
};
const saveIdToLocalStorage = (id, checkInDate) => {
  localStorage.setItem(
    "check-in-id",
    JSON.stringify({
      id: id,
      date: checkInDate,
    })
  );
};
const getIdFromLocalStorage = () => {
  if (localStorage.getItem("check-in-id") === null) return;

  const { id } = JSON.parse(localStorage.getItem("check-in-id"));
  checkInId.value = id;
};

const removeIdFromLocalStorage = () => {
  localStorage.removeItem("check-in-id");
};

const resetApp = () => {
  checkInId.value = null;
  landing.value = null;
  showThankYou.value = false;
  showTooManyRequestsWarning.value = false;
  showSpinner.value = false;
  showConnectionError.value = false;
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 3rem);
  padding-top: 1rem;
}
.warning {
  color: red;
}
</style>
