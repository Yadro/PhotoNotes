///<reference path="../declaration/dropbox-sdk.d.ts"/>
///<reference path="../declaration/react-native-fetch-blob.ts"/>
import RNFetchBlob from 'react-native-fetch-blob';
import Dropbox from 'dropbox';
import {DROPBOX_APP_KEY} from "../constants/Config";
import {STORE_KEYS} from "../constants/ActionTypes";
import {AsyncStorage} from "react-native";
import Note from "../redux/Note";
import FileMetadataReference = DropboxTypes.files.FileMetadataReference;
import FileMetadata = DropboxTypes.files.FileMetadata;
import FullAccount = DropboxTypes.users.FullAccount;
import ListFolderResult = DropboxTypes.files.ListFolderResult;
import {transliterate} from "./transliterate";

export class DropboxApi {
  dbx: DropboxTypes.Dropbox;
  private redirectUrl: string;
  private account: FullAccount;

  constructor() {
    this.dbx = new Dropbox({
      clientId: DROPBOX_APP_KEY
    });
    AsyncStorage.getItem(STORE_KEYS.accessToken).then(token => {
      if (token) {
        this.dbx.setAccessToken(token);
        this.dbx.usersGetCurrentAccount(null).then(response => {
          this.account = response;
        }).catch(err => {
          console.log('ERROR usersGetCurrentAccount', err);
        })
      }
    });
  }

  getAuthenticationUrl(redirectToApp: string): string {
    if (this.redirectUrl) {
      return this.redirectUrl;
    }
    return this.redirectUrl = this.dbx.getAuthenticationUrl(redirectToApp);
  }

  setToken(token: string) {
    this.dbx.setAccessToken(token);
    AsyncStorage.setItem(STORE_KEYS.accessToken, token);
  }

  getUserName() {
    return this.account.name;
  }

  async uploadFile(path: string, contents: string): Promise<FileMetadata | IDropboxApiError> {
    try {
      const response = await RNFetchBlob.fetch('POST', 'https://content.dropboxapi.com/2/files/upload', {
        Authorization: 'Bearer ' + this.dbx.getAccessToken(),
        'Dropbox-API-Arg': JSON.stringify({path}),
        'Content-Type': 'text/plain; charset=dropbox-cors-hack',
      }, contents);
      const info = response.info();
      if (info.status === 200) {
        return response.json();
      }
      return responseError(response.data, response);
    } catch (err) {
      return responseError(err.message, err);
    }
  }

  async downloadFile(path: string): Promise<FileMetadata | IDropboxApiError> {
    try {
      const response = await RNFetchBlob.fetch('POST', 'https://content.dropboxapi.com/2/files/download', {
        Authorization: 'Bearer ' + this.dbx.getAccessToken(),
        'Dropbox-API-Arg': JSON.stringify({path}),
        'Content-Type': ' ',
      });
      const info = response.info();
      if (info.status === 200) {
        return response.json();
      }
      return responseError(response.data, response);
    } catch (err) {
      return responseError(err.message, err);
    }
  }

  async uploadNote(note: Note): Promise<FileMetadata | IDropboxApiError> {
    return this.uploadFile('/' + note.fileName + '.md', note.title);
  }

  async filesList(): Promise<FileMetadataReference[]> {
    const response = await this.getListFiles();
    return response.entries.filter(file => file['.tag'] === 'file') as FileMetadataReference[];
  }

  async getListFiles(): Promise<ListFolderResult> {
    return await this.dbx.filesListFolder({path: ''});
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

  async addNote(note: Note) {
    note = Object.assign({}, note);
    try {
      const filesList = await this.filesList();
      let fileName = '/' + transliterate(note.title) + '.md';
      const existFile = filesList.find(e => e.path_display === fileName);
      if (existFile) {
        fileName += note.createdAt;
      }
      note.fileName = fileName;
      const response = await this.uploadNote(note);
      const responseErr = response as IDropboxApiError;
      if (responseErr.error) {
        console.log(responseErr);
        return false;
      }
      return true;
    } catch (e) {
      console.log(e);
    }
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

interface IDropboxApiError {
  error: any;
  message: string;
}

function responseError(message, error): IDropboxApiError {
  return {
    message: message,
    error,
  }
}

export const dbxApi = new DropboxApi();