<script setup>
import { onBeforeMount } from 'vue'
import { getCharacters } from './utils/helpers.js'

onBeforeMount(() => {
  // getCharacters()
})
</script>

<template>
  <div class="container">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "./assets/main.scss";
</style>
