<template>
  <f7-page>
    <f7-navbar title="Content not found" back-link="Back"></f7-navbar>
      <div class="display-flex justify-content-center align-items-center notFoundContainer">
        <h2 class="align-content-center">Sorry, the requested content cannot be found :(</h2>
        <f7-button fill @click="goBack">Go back</f7-button>
      </div>
  </f7-page>
</template>
<script>
export default {
  methods:{
    goBack(){
      this.$f7router.back();
    }
  }
};
</script>
<style>
.notFoundContainer {
  height: 100%;
  text-align: center;
  flex-direction: column;
}
</style>