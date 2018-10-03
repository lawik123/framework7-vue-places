<template>
    <f7-card :title="name">
        <f7-card-content :padding="false">
            <img class="image" src="https://www.w3schools.com/w3css/img_lights.jpg"/>
            <div style="padding: 16px">
                <p class="location">
                    {{straat}} {{huisnummer}}
                    <br>
                    {{postcode}} {{plaats}}
                </p>
                <p class="description">{{description}}</p>
            </div>
        </f7-card-content>
        <f7-card-footer>
            <f7-link>Share</f7-link>
            <f7-link>Remove</f7-link>
        </f7-card-footer>
    </f7-card>
</template>

<script>
export default {
    props:{
        id: Number,
        name: String,
        description: String,
        straat: String,
        huisnummer: Number,
        postcode: String,
        plaats: String
    }
}
</script>
<style>
.card-header {
  font-weight: bolder;
}
.image {
  width: 100%;
  height: auto;
}
.location {
  font-size: 2.5vmin;
  font-weight: bold;
}
.description {
  font-size: 3.5vmin;
}
</style>