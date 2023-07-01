<script setup>
import IconSun from './assets/svgs/sun.svg'
import IconMoon from './assets/svgs/moon.svg'

let theme = $ref(true)
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
      <div class="nav-theme inline-center" @click="changeTheme()">
        <IconSun class="icon" v-if="theme" />
        <IconMoon class="icon" v-else />
      </div>
    </div>
  </nav>
  <div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "./assets/main.scss";
@import "./assets/table.scss";
</style>
