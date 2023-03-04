export const getIdFromLocalStorage = () => {
  const ls = localStorage.getItem("check-in-id");
  if (ls === null) return;
  const { id } = JSON.parse(ls);
  if (typeof id === "string") return id as string;
  return;
};

export const localStorageHasDataFromToday = () => {
  const ls = localStorage.getItem("check-in-id");
  if (ls === null) return false;
  const { id, date } = JSON.parse(ls);

  if (
    typeof id === "string" &&
    new Date(date).toDateString() === new Date().toDateString()
  ) {
    return true;
  }

  return false;
};

export const removeIdFromLocalStorage = () => {
  localStorage.removeItem("check-in-id");
};

export const saveIdToLocalStorage = (id: string, checkInDate: string) => {
  localStorage.setItem(
    "check-in-id",
    JSON.stringify({
      id: id,
      date: checkInDate,
    })
  );
};
