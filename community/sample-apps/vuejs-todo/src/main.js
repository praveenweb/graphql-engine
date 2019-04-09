import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import AuthPlugin from "./plugins/auth";
import HighlightJs from "./directives/highlight";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import { createProvider } from './vue-apollo'
import createProvider from './apollo'
import VueApollo from 'vue-apollo'

Vue.use(AuthPlugin);
Vue.use(VueApollo);
Vue.directive("highlightjs", HighlightJs);

Vue.config.productionTip = false;

library.add(faLink);

Vue.component("font-awesome-icon", FontAwesomeIcon);

const apolloProvider = new VueApollo({
  defaultClient: createProvider(),
})

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
