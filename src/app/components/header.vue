<template>
  <div>
    <SearchForm></SearchForm>
    <Slideout></Slideout>
  </div>
</template>

<script type="text/javascript">
  import Slideout from './slideout.vue';
  import SearchForm from './searchForm.vue';
 
  module.exports = {
    components:{
      Slideout,
      SearchForm
    }
  }

</script>

<style type="text/css">
  #logo {
    display: flex;
  }
</style>