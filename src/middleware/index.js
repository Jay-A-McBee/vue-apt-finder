'use strict'

import fetch from 'isomorphic-fetch';

const config = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'      
  }
}

const BASE_URL = 'http://localhost:3000/';

export const callAPI = (endpoint) => {
  // config.method = method;
      
  return fetch(BASE_URL + endpoint, config)
    .then( response => 
      response.text()
        .then( text => ({ text, response }))
    )
    .then(({ text, response }) => {
      console.log(text,response)
      if(!response.ok){
        return Promise.reject(text);
      }else{
        return text;
      }
    })
}