import Vue from 'vue';
import App from './app.vue';
import store from './store/index.js';

new Vue({
  el: '#app',
  store,
  template:'<App></App>',
  components: { App }
})