import {lens, set, view} from 'ramda';

export const lensProp = prop => lens(
  // getter - получаем свойство
  obj => obj[prop],
  // setter - ставим свойство иммутабельно
  (newVal, obj) => ({...obj, [prop]: newVal})
);

export const over = (someLens, func, data) => {
  const val = view(someLens, data);
  const newVal = func(val);
  return set(someLens, newVal, data);
};


export const makeGetterById = id => array => array.find(item => item.id === id);
export const makeSetterById = id =>
  (newItem, array) =>
    array.map(item => item.id === id ? newItem : item);

export const lensById = id => lens(
  makeGetterById(id),
  makeSetterById(id)
);