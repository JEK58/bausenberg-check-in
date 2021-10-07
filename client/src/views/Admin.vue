<template>
  <div class="container-fluid h-100 pt-4">
    <h4>Bausenberg Admin Panel</h4>

    <div v-if="loggedIn">
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
          <tr v-for="checkin in checkins" :key="checkin._id">
            <td>{{ checkin.name }}</td>
            <td>{{ checkin.club }}</td>
            <td>{{ checkin.landing }}</td>
            <td>{{ formatDate(checkin.checkinDate) }}</td>
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="deleteCheckin(checkin._id)"
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
    <div v-else class="container login-prompt">
      <form class="px-4 py-3" @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="exampleDropdownFormPassword1" class="form-label"></label>
          <input
            type="password"
            class="form-control"
            id="exampleDropdownFormPassword1"
            placeholder="Passwort"
            v-model="password"
          />
        </div>
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
        <pre class="m-3">Password is "pw"</pre>
      </form>
    </div>
  </div>
</template>

<script>
import API from "@/services/API";
import { format } from "date-fns";

export default {
  name: "Admin",
  components: {},
  data() {
    return { checkins: [], loggedIn: true, databaseError: null, password: "" };
  },
  methods: {
    async fetchDB() {
      try {
        const response = await API.fetchDB();
        if (response.status === 200) {
          this.checkins = response.data;
          this.databaseError = false;
        } else {
          this.databaseError = true;
        }
      } catch (error) {
        console.log(error);
        this.databaseError = true;
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return "-";
      return format(new Date(timestamp), "dd.MM.yyyy - HH:mm");
    },
    async deleteCheckin(checkinId) {
      try {
        const response = await API.deleteCheckin(checkinId);
        if (response.status === 200) this.fetchDB();
      } catch (error) {
        console.log(error);
      }
    },
    handleLogin() {
      // TODO: remove this:D
      if (this.password === "pw") this.loggedIn = true;
    },
  },
  created() {
    this.fetchDB();
  },
  computed: {},
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
