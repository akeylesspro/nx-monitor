import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "chart.js/auto";
import { createPinia } from "pinia";
import persistedState from "pinia-plugin-persistedstate";
import { useThemeStore } from "./stores";
import { setup } from "./i18n";

const app = createApp(App);
const pinia = createPinia();
pinia.use(persistedState);
app.use(pinia);

const { initializeTheme } = useThemeStore();
initializeTheme();

const i18n = setup();

app.use(router);
app.use(i18n);
app.use(PrimeVue, {
    unstyled: true,
});
app.mount("#app");

export { pinia, i18n };
