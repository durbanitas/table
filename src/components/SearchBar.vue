<script setup>
import { ref } from 'vue';

// TODO: add clearable

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search...',
  },
});

const emit = defineEmits(['search']);

const searchQuery = ref(null);

const handleInput = () => {
  emit('search', searchQuery.value);
};
</script>

<template>
  <input
    @input="handleInput"
    v-model="searchQuery"
    :placeholder="placeholder"
    type="text"
    class="search-bar"
  />
</template>

<style lang="scss" scoped>
.search-bar {
  max-width: 190px;
}
</style>
