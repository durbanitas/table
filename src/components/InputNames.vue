<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])
function updateValue (value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <form>
    <label>Search </label>
    <input
      type="text"
      :value="props.modelValue"
      @input="updateValue($event.target.value)"
      placeholder="Enter a search term"
    >
  </form>
</template>


<style lang="scss" scoped>
form {
  padding: 12px;
}
</style>
