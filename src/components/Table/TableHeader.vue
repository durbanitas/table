<script setup>
const props = defineProps({
  headers: Array,
  sortedHeader: Object,
  sortDirection: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(['sort']);

const sort = (head, colIdx) => {
  emit('sort', { head, colIdx });
};
</script>

<template>
  <thead>
    <tr>
      <th
        v-for="(head, colIdx) in headers"
        :key="head.id"
        v-on="head.sortable ? { click: () => sort(head, colIdx) } : {}"
      >
        <div
          class="align-center table-name"
          :class="head.align"
        >
          <div v-html="head.label" />
          <div
            class="pl-6"
            v-if="head.sortable"
          >
            <div
              class="up-arrow"
              :class="{ 'active-up': head.columnKey === sortedHeader.columnKey && sortDirection === -1 }"
            />
            <div
              class="down-arrow"
              :class="{ 'active-down': head.columnKey === sortedHeader.columnKey && sortDirection === 1 }"
            />
          </div>
        </div>
      </th>
    </tr>
  </thead>
</template>

<style lang="scss" scoped>
.up-arrow {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  background: transparent;
  border-bottom: solid 7px var(--disabled);
  border-top-width: 0;
  cursor: pointer;
}

.down-arrow {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  background: transparent;
  border-top: solid 7px var(--disabled);
  border-bottom-width: 0;
  margin-top: 2px;
  cursor: pointer;
}

.active-up {
  border-bottom: solid 7px var(--action);
}

.active-down {
  border-top: solid 7px var(--action);
}

.text-end {
  justify-content: right;
}

.text-center {
  justify-content: center;
}

.text-start {
  justify-content: left;
}
</style>
