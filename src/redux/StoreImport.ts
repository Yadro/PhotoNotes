const RNFS = require('react-native-fs');

const path = RNFS.DocumentDirectoryPath + '/data.json';
console.log(path);


export function exportNotes(notes) {
  writeFile(path, JSON.stringify(notes));
}

export function importNotes(callback) {
  RNFS.exists(path)
    .then(() => {
      return RNFS.readFile(path, 'utf8');
    })
    .then((contents) => {
      contents = JSON.parse(contents);
      callback(contents);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
}

function writeFile(path, data) {
  RNFS.writeFile(path, data, 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });
}