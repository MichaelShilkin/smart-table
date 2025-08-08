import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

      if (action && action.name === 'sort') {
    action.dataset.value = sortMap[action.dataset.value]; // Извлекаем текущее значение сортировки из data-атрибута "value" кнопки
    field = action.dataset.field; // Получаем поле, по которому нужно сортировать — оно хранится в data-field кнопки.
    order = action.dataset.value;  // Сохраняем текущий режим сортировки (направление)

    columns.forEach(column => {
        if (column.dataset.field !== action.dataset.field) {   // Если это не та кнопка, что нажал пользователь
        column.dataset.value = 'none';                        // тогда сбрасываем её в начальное состояние
        }
    });
} else {
    columns.forEach(column => {
        if (column.dataset.value !== 'none') {
            field = column.dataset.field;
            order = column.dataset.value;
        }
    });
}
return sortCollection(data, field, order);
        
    }
}