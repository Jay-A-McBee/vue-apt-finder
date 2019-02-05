<template>
  <div>
    <form id="searchForm">
      <label for="zipcode">Zipcode</label>
        <input :class='{error: errors.zip}' type="text" name="zipcode" id='zip' v-model='formData.zip'></input>
        <small v-if='errors.zip'>{{errors.zip}}></small>
      <label for="mileage">within/mi</label>
        <input :class='{error: errors.miles}'  type="text" name="mileage" id='miles' v-model='formData.miles'></input>
        <small v-if='errors.miles'>{{errors.miles}}></small>
      <label for="minPrice">minPrice</label>
        <input :class='{error: errors.minPrice}' type="text" name="minPrice" id='min' v-model='formData.minPrice'></input> 
        <small v-if='errors.minPrice'>{{errors.minPrice}}></small>
      <label for="maxPrice">maxPrice</label>
        <input :class='{error: errors.maxPrice}' type="text" name="maxPrice" id='max' v-model='formData.maxPrice'></input>
        <small v-if='errors.maxPrice'>{{errors.maxPrice}}></small>
      <br />
      <button type='submit' @click="validate(formData, $event)">Search</button>
    </form>
  </div>
</template>

<script type="text/javascript">

  module.exports = {
    data: function(){
      return {
        formData: {
          zip:'98118',
          miles:'06',
          minPrice:'1500',
          maxPrice:'2500'
        },
        errors:{
          zip: null,
          miles: null,
          minPrice: null,
          maxPrice: null
        }
      }
    },

    methods:{
     
      validate(values, submitEvent){
        submitEvent.preventDefault();
        debugger
        
        let hasErrors = false;
        
        const errorMessages = {
          zip: () => {
            hasErrors = true;
            return 'Zipcode must 5 digits and contain only numbers';
          },  
          miles: () => {
            hasErrors = true;
            return 'Mileage range must be less than 10 miles and contain only numbers';
          },
          minPrice: () => {
            hasErrors = true;
            return 'Minimum price must contain only numbers';
          },
          maxPrice: () => { 
            hasErrors = true;
            return 'Maximum price must contain only numbers';
          } 
        };

        const validators = {
          zip: (val) => {
            const isValid = (val.length === 5 && !/[^0-9]/.test(val));
            return isValid ? false : errorMessages.zip();
          },
          miles: (val) => {
            const isValid = (val.length === 2 &&  !/[^0-9]/.test(val));
            return isValid ? false : errorMessages.miles();
          },
          minPrice: (val) => {
            return !/[^0-9]/.test(val) ? false : errorMessages.minPrice();
          },
          maxPrice: (val) => {
            return !/[^0-9]/.test(val) ? false : errorMessages.maxPrice();
          }
        }

        let errorFields = [];

        const errors = Object.keys(values).reduce( (errObj, key) => {
          const val = values[key];
          const validatorFn = validators[key]; 
          errObj[key] = validatorFn(val);
          return errObj;
        },{});

        if(hasErrors){
          this.errors = {
            ...this.errors,
            ...errors
          }
          return;
        }else{
          this.$store.dispatch('search',values);
        }
      }
    }
  }
  
</script>

<style type="text/css">
  #searchForm {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .error {
    border: 1px solid red;
  }

  button {
    width: 10%;
  }
  
</style>