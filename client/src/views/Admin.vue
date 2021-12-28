<template>
  <main class="container">
    <div v-if="loggedIn">
      <!-- Todo: Sort by years -->
      <h4>Statistik</h4>
      <ul>
        <li>
          Landewiese: <strong>{{ dbData.statistics?.regularLanding }}</strong>
        </li>
        <li>
          Außenlandung:
          <strong>{{ dbData.statistics?.alternateLanding }}</strong>
        </li>
        <li>
          Streckenflug:<strong> {{ dbData.statistics?.xcLanding }}</strong>
        </li>
        <li>
          Nicht gestartet: <strong>{{ dbData.statistics?.didNotStart }}</strong>
        </li>
      </ul>

      <p>(Statistiken pro Jahr kommen demnächst)</p>

      <h4>Liste</h4>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Verein</th>
            <th>Landung</th>
            <th>Datum</th>
            <th>
              <a href="#" @click="fetchDB"
                ><svg
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
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="checkIn in dbData.checkIns" :key="checkIn._id">
            <td>{{ checkIn.name }}</td>
            <td>{{ checkIn.club }}</td>
            <td>{{ checkIn.landing }}</td>
            <td>{{ formatDate(checkIn.checkInDate) }}</td>
            <td>
              <a
                href="#"
                role="button"
                class="outline"
                @click="showEntryDeleleModal(checkIn)"
              >
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
    </div>
    <!-- Login -->
    <div v-else>
      <main class="container">
        <article>
          <h4>Bausenberg Admin Panel</h4>

          <form class="" @submit.prevent="handleLogin">
            <div class="">
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
              <p class="">Username oder Passwort falsch</p>
            </div>
            <div class="">
              <button type="submit">Login</button>
            </div>
          </form>
        </article>
      </main>
      <!-- ./ Main -->
    </div>

    <!-- Delete Modal -->
    <dialog id="deleteEntryModal">
      <article>
        <a
          href="#"
          aria-label="Close"
          class="close"
          data-target="deleteEntryModal"
          @click="closeModal()"
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
            @click="closeModal()"
            >Abbrechen</a
          >
          <a
            href="#"
            role="button"
            data-target="deleteEntryModal"
            @click="deleteCheckIn()"
          >
            Löschen
          </a>
        </footer>
      </article>
    </dialog>
  </main>
</template>

<script setup>
import API from "@/services/API";
import { format } from "date-fns";
import { ref, computed, onMounted } from "vue";

const dbData = ref([]);
const loggedIn = ref(true);
const loginError = ref(false);
const username = ref("admin");
const password = ref("lists-foreman-utilize-AMALGAM");
const entryToDelete = ref(null);
let modal = null;

const authData = computed(() => {
  return {
    username: username.value,
    password: password.value,
  };
});
onMounted(() => {
  modal = document.getElementById("deleteEntryModal");
});

const fetchDB = async () => {
  try {
    const response = await API.fetchDB(authData.value);
    if (response.status === 200) {
      dbData.value = response.data;
      loggedIn.value = true;
      loginError.value = false;
    } else {
      loggedIn.value = false;
      loginError.value = true;
    }
  } catch (error) {
    console.log(error);
    loginError.value = true;
  }
};
const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  return format(new Date(timestamp), "dd.MM.yyyy - HH:mm");
};
const deleteCheckIn = async () => {
  try {
    const response = await API.deleteCheckIn(
      entryToDelete.value._id,
      authData.value
    );
    if (response.status === 200) fetchDB();
    closeModal(modal);
  } catch (error) {
    // TODO: Do something!
    console.log(error);
  }
};
const handleLogin = async () => {
  fetchDB();
};
const showEntryDeleleModal = (entry) => {
  entryToDelete.value = entry;
  openModal(modal);
};
// const countOccurrences = (arr, val) => {
//   console.log(
//     arr.reduce((a, v) => {
//       v.landing === val ? a + 1 : a, 0;
//     })
//   );
// };

// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const animationDuration = 400; // ms
let visibleModal = null;

// Toggle modal
// const toggleModal = (event) => {
//   event.preventDefault();
//   typeof modal != "undefined" && modal != null && isModalOpen(modal)
//     ? closeModal(modal)
//     : openModal(modal);
// };

// Is modal open
// const isModalOpen = (modal) => {
//   return modal.hasAttribute("open") && modal.getAttribute("open") != "false"
//     ? true
//     : false;
// };

// Open modal
const openModal = (modal) => {
  if (isScrollbarVisible()) {
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${getScrollbarWidth()}px`
    );
  }
  document.documentElement.classList.add(isOpenClass, openingClass);
  setTimeout(() => {
    visibleModal = modal;
    document.documentElement.classList.remove(openingClass);
  }, animationDuration);
  modal.setAttribute("open", true);
};

// Close modal
const closeModal = () => {
  visibleModal = null;
  document.documentElement.classList.add(closingClass);
  setTimeout(() => {
    document.documentElement.classList.remove(closingClass, isOpenClass);
    document.documentElement.style.removeProperty("--scrollbar-width");
    modal.removeAttribute("open");
  }, animationDuration);
};

// Close with a click outside
document.addEventListener("click", (event) => {
  if (visibleModal != null) {
    const modalContent = visibleModal.querySelector("article");
    const isClickInside = modalContent.contains(event.target);
    !isClickInside && closeModal(visibleModal);
  }
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && visibleModal != null) {
    closeModal(visibleModal);
  }
});

// Get scrollbar width
const getScrollbarWidth = () => {
  // Creating invisible container
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll"; // forcing scrollbar to appear
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement("div");
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
};

// Is scrollbar visible
const isScrollbarVisible = () => {
  return document.body.scrollHeight > screen.height;
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
