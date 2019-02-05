<template>
  <div>
    {{ msg }}
    <Header></Header>
  </div>
</template>

<script>
import Header from './components/header';
//import other components here and use in template by adding to component object to exports
module.exports = {
  
  data: () => ({
      msg: '#SeattleApt'
  }),
  
  components:{
    Header
  }

}
</script>

<style>
.message {
  color: blue;
  height: 100%;
}

.container {
  display: flex;
}
</style>