import Vue from 'vue';
import Vuex from 'vuex';
import { callAPI } from '../../middleware/index.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    listings: [],
    isFetching: false,
    errors: []
  },
  mutations: {
    request (state) {
      state.isFetching = true;
    },
    success (state, response) {
      state.listings = response;
      state.isFetching = false;
    },
    failure (state, error) {
      state.errors = [...state.errors, errors];
    }
  },
  actions: {
    request (context) {
      context.commit('request');

      return callAPI('fetch')
        .then( resp => {
          var x = resp;
          context.commit('success', JSON.parse(resp));
        })
        .catch( err => context.commit('failure', err))
    },

    more (context) {
      context.commit('request');

      return callAPI('more')
        .then( resp => {
          var x = resp;
          context.commit('success', JSON.parse(resp));
        })
        .catch( err => context.commit('failure', err))

    },

    search (context, formVals) {
      context.commit('request');

      const uriArr = Object.keys(formVals).reduce((acc,key) => [...acc,`${key}=${formVals[key]}`], []);

      debugger

      return callAPI(`more?${uriArr.join('&')}`)
        .then( resp => {
          var x = resp;
          debugger
          context.commit('success', JSON.parse(resp));
        })
        .catch( err => context.commit('failure', err))
    }
  }
})