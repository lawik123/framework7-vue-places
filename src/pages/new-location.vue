<template>
    <f7-page>
        <f7-navbar title="New location" back-link="Back"></f7-navbar>
        <f7-block>
            <f7-list no-hairlines>
                <f7-list-item>
                    <f7-label>Name</f7-label>
                    <f7-input type="text" :value="name" @input="name = $event.target.value" clear-button required validate></f7-input>
                </f7-list-item>
                <f7-list-item>
                    <f7-label>Description</f7-label>
                    <f7-input type="textarea" :value="description" @input="description = $event.target.value" clear-button required validate></f7-input>
                </f7-list-item>
                <f7-list-item>
                    <f7-label>Location</f7-label>
                    <p class="address" :style="{visibility: isValidAddress ? 'visible' : 'hidden'}">
                        {{address.road}} {{address.houseNumber}}
                        <br>
                        {{address.postcode}} {{address.city}}
                    </p>
                    <br>
                    <div class="item-input-wrap" style="text-align:center">
                        <f7-link icon-f7="compass" @click="requestLocation"></f7-link>
                    </div>
                </f7-list-item>
                <f7-list-item>
                    <f7-label>Photo</f7-label>
                    <img class="photo" v-if="photo" :src="photo">
                    <br>
                    <div class="item-input-wrap" style="text-align:center">
                        <f7-link icon-f7="camera" @click="requestCamera"></f7-link>
                    </div>
                </f7-list-item>
            </f7-list>
            <f7-button fill @click="submitForm" :disabled="isValidForm ? false : true">Add location</f7-button>
        </f7-block>
    </f7-page>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            description: '',
            address: { road: '', houseNumber: '', postcode: '', city: '' },
            photo: '',
        }
    },
    mounted() {
        document.addEventListener("backbutton", this.backButtonEventListener);
    },
    destroyed(){
        document.removeEventListener("backbutton", this.backButtonEventListener);
    },
    methods: {
        backButtonEventListener(e) {
            e.preventDefault();
            this.$f7router.back();
        },
        requestLocation() {
            cordova.plugins.diagnostic.isLocationAuthorized(authorized => {
                if (authorized) {
                    this.isLocationEnabled();
                } else {
                    cordova.plugins.diagnostic.requestLocationAuthorization(status => {
                        switch (status) {
                            case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                                this.isLocationEnabled();
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                                this.isLocationEnabled();
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                                this.$f7.dialog.alert('please grant location permission via this application\'s permission settings and try again.'
                                    , 'To use this feature:');
                                break;
                        }
                    });
                }
            });
        },
        isLocationEnabled() {
            cordova.plugins.diagnostic.isLocationEnabled(enabled => {
                if (enabled) {
                    this.getLocation();
                } else {
                    this.$f7.dialog.alert(`please turn on ${window.cordova.platformId === 'android' ? 'Location Mode' : 'Location Services'}`
                        , 'To use this feature:');
                }
            });
        },
        getLocation() {
            this.$f7.dialog.preloader();
            navigator.geolocation.getCurrentPosition(location => {
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`, {
                    method: 'GET',
                }).then(res => res.json()).then(data => {
                    let address = data.address;
                    this.address.road = address.road;
                    this.address.houseNumber = address.house_number;
                    this.address.postcode = address.postcode;
                    this.address.city = address.city;
                    this.$f7.dialog.close();
                }).catch(error => {
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Please ensure you have a connection to the internet.', 'Something went wrong');
                })
            }, error => {
                this.$f7.dialog.close();
                this.$f7.dialog.alert('Please try again.', 'Something went wrong');
            }, { timeout: 30000, enableHighAccuracy: true })
        },
        requestCamera() {
            cordova.plugins.diagnostic.isCameraAuthorized(authorized => {
                if (authorized) {
                    this.camera();
                } else {
                    cordova.plugins.diagnostic.requestCameraAuthorization(status => {
                        switch (status) {
                            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                                this.camera();
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                                this.$f7.dialog.alert('please grant camera and storage permissions via this application\'s permission settings and try again.'
                                    , 'To use this feature:');
                                break;
                        }
                    })
                }
            });
        },
        camera() {
            navigator.camera.getPicture(photo => {
                this.photo = photo
            }, error => {
                
            }, {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    encodingType: Camera.EncodingType.PNG,
                }
            );
        },
        submitForm() {
            this.$f7.dialog.preloader();
            setTimeout(() => {
                this.$root.$emit('addLocation', { ...this.$data })
            }, 1000);
        },
    },
    computed: {
        isValidAddress: function () {
            for (let key in this.address) {
                if (this.address[key].length === 0) {
                    return false;
                }
            }
            return true;
        },
        isValidForm: function () {
            return this.name.length > 0 && this.description.length > 0 && this.isValidAddress && this.photo.length > 0;
        }
    }
}
</script>

<style>
.address {
  font-size: 16px;
  margin: 0;
  padding: 7px 0;
}
.photo {
  width: 100%;
  height: auto;
}
</style>
