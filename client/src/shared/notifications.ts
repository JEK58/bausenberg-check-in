// Notifications
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

export const indicateSuccess = () => {
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

export const indicateError = () => {
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
