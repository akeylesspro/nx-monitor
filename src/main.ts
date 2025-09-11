import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { initializeThemeFromStorage } from "./theme";

initializeThemeFromStorage();

createApp(App).use(router).mount("#app");
