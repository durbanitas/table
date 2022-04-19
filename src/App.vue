<script setup>
const theme = $ref(false)
function changeTheme () {
  theme = !theme
  const strTheme = theme ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', strTheme)
}
</script>

<template>
  <nav>
    <div class="nav-container">
      <h1>Table demo</h1>
      <button class="btn" @click="changeTheme()" v-text="theme ? 'light' : 'dark'" />
    </div>
  </nav>
  <div class="container">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "./assets/main.scss";
</style>
