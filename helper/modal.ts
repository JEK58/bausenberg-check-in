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
let visibleModal: HTMLElement | null = null;

// Toggle modal
export const toggleModal = () => {
  // event.preventDefault();
  const modal: HTMLElement | null = document.getElementById("deleteEntryModal");
  typeof modal != "undefined" && modal != null && isModalOpen(modal)
    ? closeModal(modal)
    : openModal(modal);
};

// Is modal open
const isModalOpen = (modal: HTMLElement) => {
  return modal.hasAttribute("open") && modal.getAttribute("open") != "false"
    ? true
    : false;
};

// Open modal
const openModal = (modal: HTMLElement | null) => {
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
  if (modal) modal.setAttribute("open", "true");
};

// Close modal
const closeModal = (modal: HTMLElement) => {
  visibleModal = null;
  document.documentElement.classList.add(closingClass);
  setTimeout(() => {
    document.documentElement.classList.remove(closingClass, isOpenClass);
    document.documentElement.style.removeProperty("--scrollbar-width");
    modal.removeAttribute("open");
  }, animationDuration);
};

export const eventListeners = () => {
  // Close with a click outside
  document.addEventListener("click", (event: MouseEvent) => {
    if (visibleModal != null) {
      const modalContent = visibleModal.querySelector("article");
      if (!modalContent) return;
      const isClickInside = modalContent.contains(event.target as HTMLElement);
      !isClickInside && closeModal(visibleModal);
    }
  });

  // Close with Esc key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && visibleModal != null) {
      closeModal(visibleModal);
    }
  });
};

// Get scrollbar width
const getScrollbarWidth = () => {
  // Creating invisible container
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll"; // forcing scrollbar to appear
  // outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement("div");
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  if (outer.parentNode) outer.parentNode.removeChild(outer);

  return scrollbarWidth;
};

// Is scrollbar visible
const isScrollbarVisible = () => {
  return document.body.scrollHeight > screen.height;
};
