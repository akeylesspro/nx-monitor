import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "chart.js/auto";
import { createPinia } from "pinia";
import persistedState from "pinia-plugin-persistedstate";
import { useSettingsStore } from "./stores/settings";

const app = createApp(App);
const pinia = createPinia();
pinia.use(persistedState);
app.use(pinia);

const { initializeTheme } = useSettingsStore();
initializeTheme();

app.use(router);
app.use(PrimeVue, {
    unstyled: true,
});
app.mount("#app");

export { pinia };
