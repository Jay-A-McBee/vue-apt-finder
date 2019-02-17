<template>
  <div>
    <div v-if='isFetching'>Loading...</div>
    <div v-if='!isFetching && !listings.length'>That's it, sucka!!</div>
    <div v-for='item in listings' class='itemContainer column'>
      <div class='row'>
        <div class='column half'>
          <h2>{{item.title}}</h2>
          <img v-if='item.images' class='img' :src='item.images[0]'/>
          <a :href='item.url' target='_blank'>View ad</a>
          <h1 class='money'>{{item.price}}</h1>
          <h1 v-if='item.updatedAt'>{{`Updated: ${formatDate(item.updatedAt)}`}}</h1>
          <h1 v-if='item.postedAt'>{{`Posted: ${formatDate(item.postedAt)}`}}</h1>
          <pre/>{{item.attributes}}</pre>
        </div>
        <div class='column half'>
          <iframe
            height='500px'
            width='500px'
            :src="item.mapUrl+'&output=embed'">
          </iframe>
        </div>
      </div> 
      <p>{{item.description.replace(/QR Code Link to This Post/,'')}}</p>
      <div v-if='item.images' class = 'row space_between'>
        <img class = 'thumbnail' v-for='img in item.images.slice(1,6)' :src='img'/>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  
  import { mapState, mapActions } from 'vuex'
  
  module.exports = {
    
    data: () => ({
      count: 0,
      show: false,
    }),

    created: function(){
      return this.$store.dispatch('request');
    },

    computed: mapState([
      'listings',
      'isFetching'
    ]),
   
    methods:{
      request(){ 
        console.log('clicked');
        return this.$store.dispatch('request');
      },
      more(){ 
        console.log('clicked');
        return this.$store.dispatch('more');
      },
      formatDate(dateString){
        const [date,time] = dateString.split('T');
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
      }
    }
  }
</script>

<style type="text/css">
  * {
    font-family: 'Roboto', sans-serif;
  }
  .itemContainer {
    display: flex;
    padding: 10px;
    width: 75%;
    margin: auto;
    border: 1px solid black;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .space_between {
    justify-content: space-around;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .half {
    width: 600px;
  }

  .short {
    width: 25%;
  }

  .img {
    height: 300px;
    width: 400px;
  }

  .thumbnail {
    height: 100px;
    width: 100px;
  }
  
  #text {
    font-size: 4em;
    border: .5px dotted black;
    height: 200px;
    width: 300px;
  }

  .overlay {
    display: flex;
    align-items: center;
    background-color: rgba(14,11,11,.4);
    opacity:0;
    position: absolute;
    z-index: 111;
    left:0;
    top:0;
    right:0;
    bottom:0;
  }

  .money {
    color: green;
  }

  .in {
    animation-name: fadein;
    animation-duration: .5s;
    animation-fill-mode: forwards;
  }

  .out {
    animation-name: fadeout;
    animation-duration: .5s;
    animation-fill-mode: backwards;
  }

  /*animations*/

  @keyframes fadein {
    from {opacity: 0;}
    to {opacity:1;}
  }

  @keyframes fadeout {
    from {opacity: 1;}
    to {opacity:0;}
  }
</style>