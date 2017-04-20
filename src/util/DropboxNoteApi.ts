import {DropboxApi, IDropboxApiError} from "./DropboxApi";
import FileMetadata = DropboxTypes.files.FileMetadata;
import Note from "../redux/Note";
import {transliterate} from "./transliterate";

export class DropboxNoteApi extends DropboxApi {
  constructor() {
    super();
  }

  async uploadNote(note: Note): Promise<FileMetadata | IDropboxApiError> {
    return this.uploadFile(note.fileName, note.title);
  }

  async addNote(note: Note): Promise<string | boolean> {
    note = Object.assign({}, note);
    try {
      const filesList = await this.filesList();
      let fileName = '/' + transliterate(note.title) + '.md';
      const existFile = filesList.find(e => e.path_display === fileName);
      if (existFile) {
        fileName += note.createdAt;
      }
      note.fileName = fileName;
      console.log(fileName);
      const response = await this.uploadNote(note);
      const responseErr = response as IDropboxApiError;
      if (responseErr.error) {
        console.log(responseErr);
        return false;
      }
      return fileName;
    } catch (e) {
      console.log(e);
    }
  }

  private async chunkAction(action, dataArr: any[], chunkSize) {
    const size = dataArr.length;
    let result = [];
    let operationNum = Math.min(size - 1, chunkSize);
    for (let i = 0; i < size; i += operationNum) {
      operationNum = Math.min(size - 1, i + chunkSize);
      const chunk = [];
      for (let j = i; j < operationNum; j++) {
        chunk.push(action.call(this, dataArr[j]));
      }
      const chunkResult = await Promise.all(chunk);
      console.log(chunkResult);
      result = result.concat(chunkResult);
    }
    return result;
  }

  async synchronizeFromDevice(notes: Note[]) {
    try {
      const serverFiles = await this.getListFiles();
      const result = await this.chunkAction(this.uploadNote, notes, 5);

      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }
}

export const dbxApi = new DropboxNoteApi();