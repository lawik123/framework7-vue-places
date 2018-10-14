<template>
  <f7-page>
    <f7-navbar title="Locations">
      <f7-nav-right>
        <f7-link icon-f7="add" href="/new-location/"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <div v-if="locationsData.locations.length > 0">
      <location v-for="location in locationsData.locations" :key="location.id" :id="location.id" :name="location.name" :description="location.description" :address="location.address" :photo="location.photo" v-on:deleteLocation="onDeleteLocation"></location>
    </div>
    <div v-else class="display-flex justify-content-center align-items-center noLocationsContainer">
      <h2 class="align-content-center">No locations :(</h2>
      <f7-button fill href="/new-location/">Get started</f7-button>
    </div>
  </f7-page>
</template>
<script>
import location from '../components/location.vue';
export default {
  data() {
    return {
      locationsData: {
        idCounter: 0,
        locations: []
      }
    }
  },
  components: {
    location
  },
  mounted() {
    if (localStorage.getItem('locationsData')) {
      this.locationsData = JSON.parse(localStorage.getItem('locationsData'));
    }
    this.$root.$on('addLocation', location => {
      const id = this.locationsData.idCounter += 1
      window.resolveLocalFileSystemURL(location.photo, fileEntry => {
        let targetDirectory;
        if (cordova.file.documentsDirectory !== null) {
          targetDirectory = cordova.file.documentsDirectory;
        } else {
          targetDirectory = cordova.file.externalDataDirectory;
        }
        const fileName = `${id}.png`;
        window.resolveLocalFileSystemURL(targetDirectory, dir => {
          dir.getDirectory("images", { create: true }, imagesDir => {
            fileEntry.copyTo(imagesDir, fileName, success => {
              this.locationsData.locations.unshift({
                id,
                name: location.name,
                description: location.description,
                address: location.address,
                photo: `${imagesDir.toURL()}${fileName}`
              });
              this.$f7.dialog.close();
              this.$f7router.back();
            }, this.handleFileError)
          }, this.handleFileError)
        }, this.handleFileError)
      }, this.handleFileError)
    })
  },
  watch: {
    locationsData: {
      handler() {
        localStorage.setItem('locationsData', JSON.stringify(this.locationsData));
      },
      deep: true,
    },
  },
  methods: {
    handleFileError(error) {
      this.$f7.dialog.close();
      this.$f7.dialog.alert('Please try again.', 'Something went wrong');
    },
    onDeleteLocation(id, validImg) {
      const index = this.locationsData.locations.findIndex(obj => obj.id === id);
      if (index !== -1) {
        if (validImg) {
          let targetDirectory;
          if (cordova.file.documentsDirectory !== null) {
            targetDirectory = cordova.file.documentsDirectory;
          } else {
            targetDirectory = cordova.file.externalDataDirectory;
          }
          targetDirectory
          window.resolveLocalFileSystemURL(`${targetDirectory}/images/`, dir => {
            dir.getFile(`${id}.png`, { create: false }, fileEntry => {
              fileEntry.remove(file => {
                this.removeLocation(index);
              }, error => this.removeLocation(index));
            }, error => this.removeLocation(index))
          }, error => this.removeLocation(index))
        } else {
          this.removeLocation(index);
        }
      }
    },
    removeLocation(index) {
      if (index !== -1) {
        this.locationsData.locations.splice(index, 1);
        this.$f7.dialog.close();
      }
    }
  }
}
</script>
<style>
.noLocationsContainer {
  height: 100%;
  text-align: center;
  flex-direction: column;
}
</style>
