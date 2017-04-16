import Note from "../redux/Note";
import RNFetchBlob from 'react-native-fetch-blob';
const fsDepr = require('react-native-fs');
const fs = RNFetchBlob.fs;

const path = fsDepr.DocumentDirectoryPath + '/data.json';

export async function exportNotes(notes: Note[]) {
  console.info('EXPORT:', path, notes);
  return fs.writeFile(path, JSON.stringify(notes), 'utf8');
}

export async function importNotes() {
  const rawData = await fs.readFile(path, 'utf8');
  try {
    const result = JSON.parse(rawData);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.log(err);
    return [];
  }
}
