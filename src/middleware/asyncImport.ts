import {AsyncStorage} from 'react-native';
const fs = require('react-native-fs');
import Note from "../redux/Note";
import store from "../redux/Store";
import {SET_SAVE_FOLDER, STORE_KEYS} from "../constants/ActionTypes";
import {transliterate} from "../util/transliterate";

const externalPath = fs.ExternalDirectoryPath;


export async function importNotes() {
  const path = await getPathToSave();
  if (!(await fs.exists(path))) {
    return;
  }

}

export async function importTags() {
  const tags = await AsyncStorage.getItem(STORE_KEYS.tags);
  if (tags) {
    return JSON.parse(tags);
  }
}

async function getPathToSave() {
  const {other} = store.getState();
  if (other.folder) {
    return other.folder;
  }
  const path = await AsyncStorage.getItem(STORE_KEYS.folder);
  return path || externalPath;
}

function parseNoteContent(text: string) {
  const delim = text.search('\n');
  return {
    title: text.substr(0, delim),
    content: text.substr(delim + 1),
  };
}

function createName(note: Note, name) {
  if (name) {
    return new Promise(resolve => resolve(name));
  }
  let fileName = transliterate(note.title.toLowerCase());
  return fs.exists(genPath(fileName))
    .then(exists => {
      if (!exists) {
        return fileName;
      }
      fileName = `${fileName}_${note.createdAt}`;
      return fs.exists(genPath(fileName)).then(exists => {
        if (!exists) {
          return fileName;
        }
        throw new Error(`File ${genPath(fileName)} exist`);
      });
    });
}

function genPath(name) {
  return (store.getState().other.folder || externalPath) + '/' + name + '.md';
}