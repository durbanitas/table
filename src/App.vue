<script setup>
import IconSun from './assets/svgs/sun.svg';
import IconMoon from './assets/svgs/moon.svg';

import TableParent from './components/Table/TableParent.vue';
import Filtering from './components/Filtering.vue';
import SearchBar from './components/SearchBar.vue';
import { onMounted } from 'vue';
import { createDataset } from './utils/demo_data.js';

let theme = $ref(true);
const changeTheme = () => {
  theme = !theme;
  const strTheme = theme ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', strTheme);
};

let tableData = $ref({});
let showTable = $ref(false);

let N_ROWS_PER_PAGE;
let N_COLUMNS;
let SHOW_ROWS_PER_PAGE;

const _DEV = import.meta.env.DEV;
if (_DEV) {
  N_ROWS_PER_PAGE = 200;
  N_COLUMNS = 15;
  SHOW_ROWS_PER_PAGE = 10;
} else {
  N_ROWS_PER_PAGE = 50_000;
  N_COLUMNS = 15;
  SHOW_ROWS_PER_PAGE = 20;
}

// TODO: input validate 00045 values
onMounted(() => {
  initTable();
});

const initTable = () => {
  tableData = createDataset(N_COLUMNS, N_ROWS_PER_PAGE);
  showTable = true;
};

// add filter tags
let filterTags = $ref([]);
const useFilterTags = (filters) => {
  filterTags = filters;
};

let searchQuery = $ref('');
const handleSearch = (query) => {
  searchQuery = query;
};
</script>

<template>
  <nav>
    <div class="nav-container">
      <h1>Table Demo</h1>
      <div
        @click="changeTheme()"
        class="nav-theme inline-center"
      >
        <IconSun
          class="icon"
          v-if="theme"
        />
        <IconMoon
          class="icon"
          v-else
        />
      </div>
    </div>
  </nav>

  <div class="container pl-12 pr-12">
    <div
      v-if="showTable"
      class="table-header"
    >
      <Filtering
        @submit="useFilterTags"
        :headers="tableData.headers"
      />

      <SearchBar @search="handleSearch" />
    </div>
  </div>

  <div
    v-if="showTable"
    class="container table-bg"
  >
    <TableParent
      :tableData="tableData"
      :defaultSortDirection="1"
      :rowsPerPage="SHOW_ROWS_PER_PAGE"
      :N_ROWS_PER_PAGE="N_ROWS_PER_PAGE"
      :filterTags="filterTags"
      :searchQuery="searchQuery"
    />
  </div>
</template>

<style lang="scss">
@import './assets/main.scss';
@import './assets/table.scss';
</style>
