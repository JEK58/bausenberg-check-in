export function getBaseUrl() {
  let URL =
    window.location.protocol.toString() +
    "//" +
    window.location.hostname.toString();
  if (process.env.NODE_ENV == "development") {
    URL =
      window.location.protocol.toString() +
      "//" +
      window.location.hostname.toString() +
      ":3031";
  }

  return URL;
}
