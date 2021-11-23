<template>
  <div class="container h-100 pt-4">
    <h4>Bausenberg Admin Panel</h4>

    <!-- Refresh Button -->
    <div v-if="loggedIn" class="text-end">
      <button type="button" class="btn btn-primary btn-sm" @click="fetchDB">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-repeat"
          viewBox="0 0 16 16"
        >
          <path
            d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
          />
          <path
            fill-rule="evenodd"
            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
          />
        </svg>
      </button>
    </div>

    <div v-if="loggedIn">
      <!-- Todo: Sort by years -->
      <h4>Statistik</h4>
      <ul>
        <li>
          Landewiese: <strong>{{ dbData.statistics.regularLanding }}</strong>
        </li>
        <li>
          Außenlandung:
          <strong>{{ dbData.statistics.alternateLanding }}</strong>
        </li>
        <li>
          Streckenflug:<strong> {{ dbData.statistics.xcLanding }}</strong>
        </li>
        <li>
          Nicht gestartet: <strong>{{ dbData.statistics.didNotStart }}</strong>
        </li>
      </ul>

      <p>(Statistiken pro Jahr kommen demnächst)</p>

      <h4>Liste</h4>

      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Verein</th>
            <th>Landung</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="checkIn in dbData.checkIns" :key="checkIn._id">
            <td>{{ checkIn.name }}</td>
            <td>{{ checkIn.club }}</td>
            <td>{{ checkIn.landing }}</td>
            <td>{{ formatDate(checkIn.checkInDate) }}</td>
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="showEntryDeleleModal(checkIn._id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Login -->
    <div v-else class="container login-prompt">
      <form class="px-4 py-3" @submit.prevent="handleLogin">
        <div class="mb-3">
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
        </div>
        <div v-if="loginError">
          <p class="text-danger">Username oder Passwort falsch</p>
        </div>
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
      </form>
    </div>

    <!-- Delete Modal -->
    <div id="deleteEntryModal" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Eintrag löschen?</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-danger"
              data-bs-dismiss="modal"
              @click="deleteCheckIn(entryIdToDelete)"
            >
              Löschen
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/services/API";
import { format } from "date-fns";
import { Modal } from "bootstrap";

export default {
  name: "Admin",
  components: {},
  data() {
    return {
      dbData: [],
      loggedIn: false,
      loginError: false,
      username: "",
      password: "",
      entryIdToDelete: null,
      deleteEntryModal: null,
    };
  },
  computed: {
    authData() {
      return {
        username: this.username,
        password: this.password,
      };
    },
  },
  mounted() {
    this.deleteEntryModal = new Modal(
      document.getElementById("deleteEntryModal")
    );
  },
  methods: {
    async fetchDB() {
      try {
        const response = await API.fetchDB(this.authData);
        if (response.status === 200) {
          this.dbData = response.data;
          this.loggedIn = true;
          this.loginError = false;
        } else {
          this.loggedIn = false;
          this.loginError = true;
        }
      } catch (error) {
        console.log(error);
        this.loginError = true;
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return "-";
      return format(new Date(timestamp), "dd.MM.yyyy - HH:mm");
    },
    async deleteCheckIn(checkInId) {
      try {
        const response = await API.deleteCheckIn(checkInId, this.authData);
        if (response.status === 200) this.fetchDB();
      } catch (error) {
        // TODO: Do something!
        console.log(error);
      }
    },
    async handleLogin() {
      this.fetchDB();
    },
    showEntryDeleleModal(id) {
      this.entryIdToDelete = id;
      this.deleteEntryModal.show();
    },
    countOccurrences(arr, val) {
      console.log(
        arr.reduce((a, v) => {
          v.landing === val ? a + 1 : a, 0;
        })
      );
    },
  },
};
</script>
<style scoped>
.login-prompt {
  max-width: 500px;
}
ul {
  list-style-type: none;
}
</style>
