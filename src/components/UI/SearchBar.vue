<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search ...'
  }
})

const emit = defineEmits(['search'])

const searchQuery = ref('')

const handleInput = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <input 
    type="text" 
    v-model="searchQuery"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>

<style lang="css" scoped>

</style>