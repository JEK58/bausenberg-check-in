<template>
  <main class="container">
    <div v-if="loggedIn">
      <h4>Bausenberg Admin Panel</h4>
      <!-- Statistics -->
      <nav>
        <ul>
          <li><h4>Statistik</h4></li>
        </ul>
        <ul>
          <li>
            <a href="#" role="button" class="" @click="fetchDB"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-arrow-repeat"
                viewBox="0 0 20 20"
              >
                <path
                  d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
                />
                <path
                  fill-rule="evenodd"
                  d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                />
              </svg>
            </a>
          </li>
          <li>
            <select id="years" v-model="filterByYear">
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </li>
        </ul>
      </nav>
      <article>
        <h6>
          Gesamt: <strong>{{ dataToShow?.length }}</strong>
        </h6>

        <ul>
          <li>
            Landewiese: <strong>{{ statistics?.regularLanding ?? 0 }}</strong>
          </li>
          <li>
            Notlandewiese:
            <strong>{{ statistics?.alternateLanding ?? 0 }}</strong>
          </li>
          <li>
            Streckenflug:<strong> {{ statistics?.xcLanding ?? 0 }}</strong>
          </li>
          <li>
            Nicht gestartet:
            <strong>{{ statistics?.didNotStart ?? 0 }}</strong>
          </li>
          <li>
            Landung nicht gemeldet:
            <strong>{{ statistics?.notReported ?? 0 }}</strong>
          </li>
        </ul>
      </article>
      <!-- Entries -->
      <h4>Liste</h4>
      <article>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Verein</th>
              <th>Landung</th>
              <th>Datum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="checkIn in dataToShow" :key="checkIn._id">
              <td>{{ checkIn.name }}</td>
              <td>{{ checkIn.club }}</td>
              <td>{{ checkIn.landing }}</td>
              <!-- TODO: Ignore timezone… -->
              <td>{{ formatDate(checkIn.checkInDate) }}</td>
              <td>
                <a href="#" class="warning" @click="onDeleteEntry(checkIn)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    class="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
    <div v-else></div>
    <!-- Login -->
    <div v-if="!loggedIn">
      <article>
        <h4>Bausenberg Admin Panel</h4>

        <form @submit.prevent="handleLogin">
          <label for="username" class="form-label"></label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Username"
          />

          <label for="password" class="form-label"></label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Passwort"
          />
          <p v-if="loginError" class="warning">{{ loginError }}</p>
          <button type="submit">Login</button>
        </form>
      </article>
    </div>

    <!-- Delete Modal -->
    <dialog id="deleteEntryModal">
      <article>
        <a
          href="#"
          aria-label="Close"
          class="close"
          data-target="deleteEntryModal"
          @click="toggleModal()"
        >
        </a>
        <h4>Eintrag löschen?</h4>
        <p>{{ entryToDelete?.name }}</p>
        <p>{{ formatDate(entryToDelete?.checkInDate) }}</p>

        <footer>
          <a
            href="#"
            role="button"
            class="secondary"
            data-target="deleteEntryModal"
            @click="toggleModal()"
            >Abbrechen
          </a>
          <a
            href="#"
            role="button"
            data-target="deleteEntryModal"
            @click="deleteEntry()"
          >
            Löschen
          </a>
        </footer>
      </article>
    </dialog>
  </main>
</template>

<script setup lang="ts">
import API from "@/services/API";
import { ref, computed } from "vue";
import { indicateError, indicateSuccess } from "@/shared/notifications";
import { formatInTimeZone, format } from "date-fns-tz";
import axios from "axios";
import {
  toggleModal,
  eventListeners as modalEventListeners,
} from "@/shared/modal";
import type CheckIn from "@/types/Checkin";

const dbData = ref<CheckIn[] | null>(null);
const loggedIn = ref(false);
const loginError = ref<string | boolean>(false);
const username = ref("");
const password = ref("");
const entryToDelete = ref<CheckIn | null>(null);

modalEventListeners();

const authData = computed(() => {
  return {
    username: username.value,
    password: password.value,
  };
});

// Login
const handleLogin = async () => {
  try {
    const response = await API.fetchDB(authData.value);
    dbData.value = response.data;
    loggedIn.value = true;
    loginError.value = false;
  } catch (error) {
    loggedIn.value = false;
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        loginError.value = "Zu viele Anmeldeversuche, warte bitte eine Minute";
        return;
      }
      if (error.response?.status === 401) {
        loginError.value = "Username oder Passwort falsch";
        return;
      }
    }
    indicateError();
  }
};

// DB fetch
const fetchDB = async () => {
  try {
    const response = await API.fetchDB(authData.value);
    dbData.value = response.data;
  } catch (error) {
    indicateError();
    console.log(error);
  }
};

// Delete Checkin
const onDeleteEntry = (entry: CheckIn) => {
  if (entry != null) entryToDelete.value = entry;
  toggleModal();
};

const deleteEntry = async () => {
  try {
    if (!entryToDelete.value) throw new Error("No entry to delete");

    const response = await API.deleteEntry(
      entryToDelete.value._id,
      authData.value
    );
    if (response.status === 200) await fetchDB();
    toggleModal();
    indicateSuccess();
  } catch (error) {
    toggleModal();
    indicateError();
    console.log(error);
  }
};
// Format date
const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return "-";
  return formatInTimeZone(
    new Date(timestamp),
    "Europe/Berlin",
    "dd.MM.yy - HH:mm"
  );
};

// Filter data
const filterByYear = ref(format(new Date(), "yyyy"));

const dataToShow = computed(() => {
  if (!dbData.value) return;
  if (!filterByYear.value) return dbData.value;

  return dbData.value.filter(
    (e: CheckIn) =>
      format(new Date(e.checkInDate), "yyyy") == filterByYear.value
  );
});

// Statistics
const countOccurences = (
  array: CheckIn[],
  searchString: string | undefined
) => {
  let count = 0;
  array.forEach((x) => {
    if (x.landing === searchString) count += 1;
  });
  return count;
};

const statistics = computed(() => {
  const stats = {
    didNotStart: 0,
    regularLanding: 0,
    alternateLanding: 0,
    xcLanding: 0,
    notReported: 0,
  };
  if (!dataToShow.value || dataToShow.value.length < 1) return stats;

  stats.didNotStart = countOccurences(dataToShow.value, "Doch nicht gestartet");
  stats.regularLanding = countOccurences(dataToShow.value, "Landewiese");
  stats.alternateLanding = countOccurences(dataToShow.value, "Notlandewiese");
  stats.xcLanding = countOccurences(dataToShow.value, "Streckenflug");
  stats.notReported = countOccurences(dataToShow.value, undefined);
  return stats;
});

// Get available years
const availableYears = computed(() => {
  if (!dbData.value) return;

  // Allways add current year. Even if no flights are present
  let prevValue = format(new Date(), "yyyy");
  const years = [prevValue];

  dbData.value.forEach((checkin) => {
    const year = format(new Date(checkin.checkInDate), "yyyy");
    if (!years.find((e) => e === year) && year != prevValue) years.push(year);
  });
  return years;
});
</script>
<style scoped>
main {
  padding-top: 1rem;
}
.warning {
  color: red;
}
</style>
