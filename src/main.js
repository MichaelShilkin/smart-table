import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // копируем для последующего изменения
  // @todo: использование
  query = applySearching(query, state, action);
  query = applyPagination(query, state, action); // обновляем query
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);

  const { total, items } = await api.getRecords(query); // запрашиваем данные с собранными параметрам
  updatePagination(total, query); // перерисовываем пагинатор
  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация

// Инициализация поиска
const applySearching = initSearching('searchField');

// Инициализация пагинации
const { applyPagination, updatePagination } = initPagination();

// Инициализация сортировки
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// Инициализация фильтрации
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(render);
