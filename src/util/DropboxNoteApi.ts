import {DropboxApi, IDropboxApiError} from "./DropboxApi";
import FileMetadata = DropboxTypes.files.FileMetadata;
import Note from "../redux/Note";
import {transliterate} from "./transliterate";

export class DropboxNoteApi extends DropboxApi {
  cloudFilesList: any[];

  constructor() {
    super();
  }

  async uploadNote(note: Note): Promise<FileMetadata | IDropboxApiError> {
    return this.uploadFile(note.fileName, note.title);
  }

  /** @deprecated */
  async uploadNewNote(note: Note): Promise<string | boolean> {
    note = Object.assign({}, note);
    try {
      note.fileName = await this.setFileName(note);
      const response = await this.uploadNote(note);
      const responseErr = response as IDropboxApiError;
      if (responseErr.error) {
        console.log(responseErr);
        return false;
      }
      return note.fileName;
    } catch (e) {
      console.log(e);
    }
  }

  async setFileName(note: Note): Promise<Note> {
    if (note.fileName) {
      return note;
    }
    try {
      const filesList = this.cloudFilesList || await this.filesList();
      let fileName = transliterate(note.title);
      const path = `/${fileName}.md`;
      const existFile = filesList.find(e => e.path_display === path);
      if (existFile) {
        fileName += '_' + note.createdAt;
      }
      fileName = `/${fileName}.md`;
      note.fileName = fileName;
      return note;
    } catch (e) {
      console.log(e);
    }
  }
  
  async synchronizeWithCloud(notes: Note[]) {
    const filesName = notes.map(e => e.fileName);
    try {
      this.cloudFilesList = await this.filesList();

      const notesWithFilename = await Promise.all(notes.map(e => {
        return this.setFileName(e);
      }));

      const notSyncedLocalNotes = notesWithFilename.filter(e => !e.saved);
      const missingOnServerNotes = notes.filter(e => {
        return !notSyncedLocalNotes.includes(e) &&
          e.fileName && !this.cloudFilesList.includes(e.fileName)
      });
      console.log('missingOnServerNotes', missingOnServerNotes);
      console.log('notSyncedLocalNotes', notSyncedLocalNotes);

      const newLocalNotes = notSyncedLocalNotes.concat(missingOnServerNotes);
      console.log('newLocalNotes', newLocalNotes);
      const uploadedFiles = await this.chunkAction(this.uploadNote, newLocalNotes, 5);

      // const newCloudFiles = serverFiles.filter(e => !filesName.includes(e.path_display));
      // const downloadedFiles = await this.chunkAction(this.downloadFile, newCloudFiles, 5);
      // console.log(({newLocalNotes, newCloudFiles}));
      const res = {
        uploadedFiles,
        // downloadedFiles,
      };
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
    }
  }
}

export const dbxApi = new DropboxNoteApi();