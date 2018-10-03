<template>
  <f7-page>
    <f7-navbar title="Locations">
      <f7-nav-right>
        <f7-link icon-f7="add"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <location v-for="i in 10" :key="i" :id="i" :name="'test'+i" :description="'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ulla....'" :straat="'M.H. Tromplaan'" :huisnummer="28" :postcode="'7513 AB'" :plaats="'Enschede'"></location>
  </f7-page>
</template>
<script>
import location from '../components/location.vue';
export default {
  components: {
    location
  },
}
</script>
