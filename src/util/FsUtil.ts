import Note from "../redux/Note";
import store from "../redux/Store";
import RNFetchBlob from 'react-native-fetch-blob';
const fsDepr = require('react-native-fs');
const fs = RNFetchBlob.fs;

const path = fsDepr.DocumentDirectoryPath + '/data.json';

export async function exportNotes(notes: Note[]) {
  return fs.writeFile(path, JSON.stringify(store.getState().notes), 'utf8');
}

export async function importNotes() {
  const result = await fs.readFile(path, 'utf8');
  return JSON.parse(result);
}
