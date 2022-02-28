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
  <form class="shadow">
    <label>Name </label>
    <input
      type="text"
      :value="props.modelValue"
      @input="updateValue($event.target.value)"
      placeholder="Search for characters..."
    >
  </form>
</template>


<style lang="scss" scoped>
form {
  padding: 6px;
  width: 260px;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  label {
    padding: 8px 4px 8px 4px;
    border: 1px solid #fff;
  }
}
input {
  width: 200px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 1em;
  border-radius: 6px;
}
input:focus {
  border-color: #ccc;
}
</style>
