import { getPages } from "../lib/utils.js"; // вспомогательная функция для вычисления видимых страниц

let pageCount; // общее количество страниц

export function initPagination(renderCallback) {
  const template = document.querySelector("#pagination");
  const container = template.content.querySelector(".pagination-container"); // основной контейнер пагинации

  const pages = container.querySelector(".pagination-pages");
  const fromRow = container.querySelector("[data-name='fromRow']");
  const toRow = container.querySelector("[data-name='toRow']");
  const totalRows = container.querySelector("[data-name='totalRows']");
  const pageTemplate = pages.querySelector("label");

  const btnFirst = container.querySelector("[name='first']");
  const btnPrev = container.querySelector("[name='prev']");
  const btnNext = container.querySelector("[name='next']");
  const btnLast = container.querySelector("[name='last']");

  function createPage(el, pageNumber, isActive) {
    el.querySelector("input").value = pageNumber; // задаём значение радиокнопки
    el.querySelector("span").textContent = pageNumber; // отображаем номер страницы
    el.querySelector("input").checked = isActive; // активная страница выделена

    // Обработчик клика по кнопке страницы
    el.querySelector("input").addEventListener("change", () => {
      renderCallback({ name: "goto", page: pageNumber }); // вызываем render с выбранной страницей
    });

    return el;
  }

  // Применение пагинации к запросу
  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // @todo: #2.6 — обработать действия
    if (action)
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    return Object.assign({}, query, {
      // добавим параметры к query, но не изменяем исходный объект
      limit,
      page,
    });
  };

  // Обновление отображения пагинации
  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit); // считаем общее количество страниц

    // @todo: #2.4 — получить список видимых страниц и вывести их
    const visiblePages = getPages(page, pageCount, 5); // Получим массив страниц, которые нужно показать, выводим только 5 страниц
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        // перебираем их и создаём для них кнопку
        const el = pageTemplate.cloneNode(true); // клонируем шаблон, который запомнили ранее
        return createPage(el, pageNumber, pageNumber === page); // вызываем колбэк из настроек, чтобы заполнить кнопку данными
      })
    );
    // @todo: #2.5 — обновить статус пагинации
    fromRow.textContent = (page - 1) * limit + 1; // С какой строки выводим
    toRow.textContent = Math.min(page * limit, total); // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
    totalRows.textContent = total; // Сколько всего строк выводим на всех страницах вместе (после фильтрации будет меньше)
  };

  // --- Обработчики навигационных кнопок ---
  btnFirst.addEventListener("click", (e) => {
    e.preventDefault();
    renderCallback({ name: "first" });
  });
  btnPrev.addEventListener("click", (e) => {
    e.preventDefault();
    renderCallback({ name: "prev" });
  });
  btnNext.addEventListener("click", (e) => {
    e.preventDefault();
    renderCallback({ name: "next" });
  });
  btnLast.addEventListener("click", (e) => {
    e.preventDefault();
    renderCallback({ name: "last" });
  });

  return {
    applyPagination,
    updatePagination,
  };
}
