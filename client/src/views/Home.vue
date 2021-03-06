<script setup lang="ts">
import API from "@/services/API";
import { ref, computed, onBeforeMount } from "vue";
import axios from "axios";
import Landing from "@/types/Landing";
import Club from "@//types/Club";

const name = ref("");
const club = ref<Club | null>(null);
const landing = ref<Landing | null>(null);
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
    if (!club.value) throw Error;
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        showTooManyRequestsWarning.value = true;
        showSpinner.value = false;
        return;
      }
    }
    showConnectionError.value = true;
    showSpinner.value = false;
    return;
  }
};

const addCheckOut = async () => {
  try {
    showSpinner.value = true;
    if (!landing.value || !checkInId.value) throw Error;
    const response = await API.addCheckOut(checkInId.value, landing.value);
    if (response.status === 201) {
      showThankYou.value = true;
      removeIdFromLocalStorage();
      showSpinner.value = false;
      showConnectionError.value = false;
      return;
    }
  } catch (error) {
    showConnectionError.value = true;
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 400) {
        // Escape if there is something wrong with the server.
        // User doesn't care. Dirty but good enough.
        showThankYou.value = true;
        removeIdFromLocalStorage();
        showSpinner.value = false;
        return;
      }
    }
    showConnectionError.value = true;
    showSpinner.value = false;
    return;
  }
};
const saveIdToLocalStorage = (id: string, checkInDate: string) => {
  localStorage.setItem(
    "check-in-id",
    JSON.stringify({
      id: id,
      date: checkInDate,
    })
  );
};
const getIdFromLocalStorage = () => {
  const ls = localStorage.getItem("check-in-id");
  if (ls === null) return;
  const { id } = JSON.parse(ls);
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
<template>
  <main class="container">
    <!-- Check-in -->
    <div v-if="!checkInId && showThankYou == false">
      <h3>Bausenberg Check-in</h3>

      <section>
        <input id="name" v-model="name" type="text" placeholder="Voller Name" />

        <input
          id="btn-rml"
          v-model="club"
          type="radio"
          name="btnradioclub"
          :value="Club.RML"
        />
        <label for="btn-rml">RML</label>

        <input
          id="btn-dgc"
          v-model="club"
          type="radio"
          name="btnradioclub"
          :value="Club.DGC"
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
            :value="Landing.MainLanding"
          />
          Landewiese 👌
        </label>

        <label for="btn-alternate-landing">
          <input
            id="btn-alternate-landing"
            v-model="landing"
            type="radio"
            name="btnradio"
            :value="Landing.AltLanding"
          />
          Notlandewiese 🧐
        </label>

        <label for="btn-xc-landing">
          <input
            id="btn-xc-landing"
            v-model="landing"
            type="radio"
            name="btnradio"
            :value="Landing.XCLanding"
          />
          Streckenflug 🎉
        </label>

        <label for="btn-no-takeoff">
          <input
            id="btn-no-takeoff"
            v-model="landing"
            type="radio"
            name="btnradio"
            :value="Landing.NoTakeoff"
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
<style scoped>
main {
  min-height: calc(100vh - 3rem);
  padding-top: 1rem;
}
.warning {
  color: red;
}
</style>
