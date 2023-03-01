export const getIdFromLocalStorage = () => {
  const ls = localStorage.getItem("check-in-id");
  if (ls === null) return;
  const { id } = JSON.parse(ls);
  if (typeof id === "string") return id as string;
  return;
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
