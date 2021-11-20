import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-dark-5/dist/css/bootstrap-dark.min.css";

let app = createApp(App);
app.use(router);

app.mount("#app");
