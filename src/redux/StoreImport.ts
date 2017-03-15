import Note from "../screens/Note";
import {transliterate} from "../util/transliterate";
import {Actions} from "./Actions";
const fs = require('react-native-fs');

const path = fs.DocumentDirectoryPath + '/data.json';
const externalPath = fs.ExternalDirectoryPath;
console.log(externalPath);

export async function exportNotes(notes: Note[]) {
  notes.forEach(n => {
    writeFileNote(n);
  });
  writeFile(path, JSON.stringify(notes));
}

export function importNotes(callback) {
  fs.exists(path)
    .then(() => {
      return fs.readFile(path, 'utf8');
    })
    .then((contents) => {
      contents = JSON.parse(contents);
      callback(contents);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
}

async function writeFileNote(note: Note) {
  if (note.saved) {
    return;
  }
  try {
    let fileName = note.fileName || await createName(note);
    console.log(fileName);
    if (!note.fileName) {
      Actions.setFileName(note.id, fileName);
    }
    return fs.writeFile(`${externalPath}/${fileName}.md`, note.title + '\n' + note.content, 'utf8')
      .then(e => {
        console.log('Saved file: ' + fileName);
        Actions.setSaved(note.id)
      })
      .catch(e => console.error(e));
  } catch (e) {

  }
}

function createName(note: Note) {
  let fileName = transliterate(note.title.toLowerCase());
  return fs.exists(externalPath + '/' + fileName)
    .then(exists => {
      if (!exists) {
        return fileName;
      }
      fileName = `${fileName}_${note.createdAt}`;
      return fs.exists(externalPath + '/' + fileName)
    }).then(exists => {
    if (!exists) {
      return fileName;
    }
    throw new Error(`File ${externalPath}/${fileName} exist`);
  });
}

function writeFile(path, data) {
  fs.writeFile(path, data, 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });
}