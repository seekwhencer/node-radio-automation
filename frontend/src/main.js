import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueResource from "vue-resource";

Vue.prototype.$store = store;

// @TODO - place it in (a) file(s)
Vue.prototype.$config = {
    api: {
        url: 'http://devradio:8200/v1'
    }
};

Vue.config.productionTip = false;


Vue.use(VueResource);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
