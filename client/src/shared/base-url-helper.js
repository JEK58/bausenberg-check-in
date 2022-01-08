export function getBaseUrl() {
  let URL =
    window.location.protocol.toString() +
    "//" +
    window.location.hostname.toString();
  if (import.meta.env.DEV) {
    console.log(import.meta.env.MODE);
    URL =
      window.location.protocol.toString() +
      "//" +
      window.location.hostname.toString() +
      ":3031";
  }
  return URL;
}
