<template>
  <main class="container">
    <div v-if="loggedIn">
      <!-- Todo: Sort by years -->
      <h4>Statistik</h4>
      <ul>
        <li>
          Landewiese: <strong>{{ dbData?.statistics?.regularLanding }}</strong>
        </li>
        <li>
          Außenlandung:
          <strong>{{ dbData?.statistics?.alternateLanding }}</strong>
        </li>
        <li>
          Streckenflug:<strong> {{ dbData?.statistics?.xcLanding }}</strong>
        </li>
        <li>
          Nicht gestartet:
          <strong>{{ dbData?.statistics?.didNotStart }}</strong>
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
          <tr v-for="checkIn in dbData?.checkIns" :key="checkIn._id">
            <td>{{ checkIn.name }}</td>
            <td>{{ checkIn.club }}</td>
            <td>{{ checkIn.landing }}</td>
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

<script setup>
import API from "@/services/API";
import { format } from "date-fns";
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const dbData = ref(null);
const loggedIn = ref(false);
const loginError = ref(false);
const username = ref("");
const password = ref("");
const entryToDelete = ref(null);

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
    if (error.response?.status === 429) {
      loginError.value = "Zu viele Anmeldeversuche, warte bitte eine Minute";
      return;
    }
    if (error.response?.status === 401) {
      loginError.value = "Username oder Passwort falsch";
      return;
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

// Notifications

const indicateSuccess = () => {
  const successToast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  successToast.fire({
    icon: "success",
    title: "Eintrag gelöscht",
  });
};

const indicateError = () => {
  const errorToast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  errorToast.fire({
    icon: "error",
    title: "Da ist leider was schief gelaufen",
  });
};

// Delete Checkin
const onDeleteEntry = (entry) => {
  entryToDelete.value = entry;
  toggleModal();
};

const deleteEntry = async () => {
  try {
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
const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  return format(new Date(timestamp), "dd.MM.yy - HH:mm");
};

/*
 * Modal
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2021 - Licensed under MIT
 */

// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const animationDuration = 400; // ms
let visibleModal = null;

// Toggle modal
const toggleModal = () => {
  // event.preventDefault();
  const modal = document.getElementById("deleteEntryModal");
  typeof modal != "undefined" && modal != null && isModalOpen(modal)
    ? closeModal(modal)
    : openModal(modal);
};

// Is modal open
const isModalOpen = (modal) => {
  return modal.hasAttribute("open") && modal.getAttribute("open") != "false"
    ? true
    : false;
};

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
const closeModal = (modal) => {
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
main {
  padding-top: 1rem;
}
.warning {
  color: red;
}
</style>
