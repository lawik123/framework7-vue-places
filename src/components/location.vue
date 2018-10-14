<template>
    <f7-card>
        <f7-card-header>
            <div class="headerContainer display-flex justify-content-space-between">
                <div class="locationName">{{name}}</div>
                <f7-link icon-f7="close" icon-color="red" @click="confirmDelete"></f7-link>
            </div>
        </f7-card-header>
        <f7-card-content :padding="false">
            <div v-if="validImg">
                <img class="image" :src="photo" @error="imgError" />
            </div>
            <div v-else>
                <h2 class="imageError">Something went wrong, perhaps you deleted this photo.</h2>
            </div>
            <div style="padding: 16px">
                <p class="location">
                    {{address.road}} {{address.houseNumber}}
                    <br>
                    {{address.postcode}} {{address.city}}
                </p>
                <p class="description">{{description}}</p>
            </div>
        </f7-card-content>
    </f7-card>
</template>

<script>
export default {
    data() {
        return {
            validImg: true,
        }
    },
    props: {
        id: Number,
        name: String,
        description: String,
        address: Object,
        photo: String,
    },
    methods: {
        imgError() {
            this.validImg = false;
        },
        confirmDelete() {
            this.$f7.dialog.confirm(`<div class="confirmDeleteName"><b>${this.name}</b></div> will be deleted from your locations.`,
                'Delete from locations?',
                () => {
                    this.$f7.dialog.preloader();
                    setTimeout(() => {
                        this.$emit('deleteLocation', this.id, this.validImg), 1000
                    });
                }
            )
        }
    }
}
</script>
<style>
.card-header {
  padding-right: 4px !important;
}
.headerContainer {
  font-weight: bolder;
  width: 100%;
}
.headerContainer > a {
  height: fit-content !important;
}
.locationName {
  white-space: nowrap;
  overflow-x: auto;
}
.image {
  width: 100%;
  height: auto;
}
.imageError {
  padding: 30px;
  background-color: lightgrey;
  margin: 0;
}
.location {
  font-size: 2.5vmin;
  font-weight: bold;
}
.description {
  font-size: 3.5vmin;
}
.confirmDeleteName {
  max-width: 100%;
  white-space: nowrap;
  overflow-x: auto;
}
</style>