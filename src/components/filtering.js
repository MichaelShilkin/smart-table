// @todo: #4.3 — настроить компаратор

export function initFiltering(elements) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes) // Получаем ключи из объекта
      .forEach((elementName) => {
        // Перебираем по именам
        elements[elementName].append(
          // в каждый элемент добавляем опции
          ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
            .map((name) => {
              // используйте name как значение и текстовое содержимое
              const el = document.createElement("option"); // @todo: создать и вернуть тег опции
              el.value = name; // задаём атрибут value
              el.textContent = name; // задаём текст внутри option
              return el;
            })
        );
      });
  };

  const applyFiltering = (query, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      // Проверяем, что пришло действие (action) и что его имя равно 'clear' — это кнопка очистки
      const field = action.dataset.field; // Берём из кнопки очистки значение атрибута data-field — это имя поля, которое нужно очистить
      const parent = action.parentElement; // Находим родительский элемент кнопки — это контейнер с кнопкой и полем ввода
      const input = parent.querySelector("input"); // В родителе ищем элемент input — это поле ввода, которое нужно очистить
      if (input) input.value = ""; // Если поле ввода найдено, очищаем его значение, ставим пустую строку
      if (field && field in state) state[field] = ""; // Если поле существует и такое имя есть в объекте состояния state — тоже очищаем его в state,
      // чтобы внутренняя модель состояния таблицы синхронизировалась с визуальным очищением
    }
    // @todo: #4.5 — отфильтровать данные используя компаратор
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // ищем поля ввода в фильтре с непустыми данными
          filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
        }
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query; // если в фильтре что-то добавилось, применим к запросу
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
