<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  idx: Number,
  show: Boolean,
  planetInfo: Object
})

const emit = defineEmits(['close'])
function closePopup (idx) {
  emit('close', idx)
}

function transformValue (value) {
  if (value !== 'unknown' && value !== "0") {
    return Number(value).toLocaleString('en-US')
  } else {
    return 'unknown'
  }
}

</script>

<template>
  <div
    class="popup"
    v-if="props.show"
  >
    <div
      class="popup shadow pointer"
      @click="closePopup(props.idx)"
    >
      <div class="popup-body">
        <h5>{{ props.planetInfo.name }}</h5>
        <div>p: {{ transformValue(props.planetInfo.population) }}</div>
        <div>d: {{ transformValue(props.planetInfo.diameter) }} km</div>
        <div>c: {{ props.planetInfo.climate }}</div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.popup .popup {
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 0 0 8px 0;
  position: absolute;
  z-index: 10;
  margin-left: -50px;
}
</style>
