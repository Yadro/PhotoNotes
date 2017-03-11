import Note from "../Note";
import * as R from 'ramda';
const {lens, set, view} = R;

export type NoteState = Note[];

export const DefaultState: NoteState = [];



const makeGetterById = id => array => array.find(item => item.id === id);
const makeSetterById = id =>
  (newItem, array) =>
    array.map(item => item.id === id ? newItem : item);

const lensById = id => lens(
  makeGetterById(id),
  makeSetterById(id)
);

const lensProp = prop => lens(
  // getter - получаем свойство
  obj => obj[prop],
  // setter - ставим свойство иммутабельно
  (newVal, obj) => ({...obj, [prop]: newVal})
);

const over = (someLens, func, data) => {
  const val = view(someLens, data);
  const newVal = func(val);
  return set(someLens, newVal);
};

const lensUpdatedAt = lensProp('updatedAt');
const lensName = lensProp('name');

export default (state: Note[] = [], actions): NoteState => {
  let newState: Note[], note: Note, id;
  switch (actions.type) {
    case 'ADD':
      id = getMax(state) + 1;
      note = actions.note;
      note.id = id;
      note.createdAt = actions.createdAt;
      return [
        ...state,
        note
      ];
    case 'UPDATE':
      note = actions.note;
      newState = [...state];
      note.updatedAt = actions.updatedAt;
      newState = newState.map(e => {
        if (e.id == note.id) {
          return note;
        }
        return e;
      });
      return newState;

    case 'REMOVE':
      newState = copy(state);
      id = actions.id;
      newState = newState.filter(e => e.id != id);
      return newState;

    case 'REMOVE_ARR':
      newState = copy(state);
      const {ids} = actions;
      newState = newState.filter(e => !ids.includes(e.id));
      return newState;

    case 'IMPORT':
      return actions.notes;

    default:
      return state;
  }
};

function getMax(arr: {id}[]) {
  let max = 0;
  arr.forEach(e => {
    max = Math.max(e.id, max)
  });
  return max;
}

function copy(o) {
  return JSON.parse(JSON.stringify(o));
}