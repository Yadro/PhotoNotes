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

  async uploadNote(note: Note) {
    return this.uploadFile('/' + note.fileName + '.md', note.title);
  }

  async getListFiles() {
    try {
      const response = await this.dbx.filesListFolder({path: ''});
      const files = response.entries.filter(file => file['.tag'] === 'file');
      return files.map((file: FileMetadataReference) => {
        return {
          file: file.name,
          client_modified: file.client_modified,
          content_hash: file.content_hash,
        }
      })
    } catch (err) {
      return responseError(err);
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

interface IDropboxApiError {
  message: string;
  error: any;
}

function responseError(message, error): IDropboxApiError {
  return {
    message: message,
    error,
  }
}

export const dbxApi = new DropboxApi();