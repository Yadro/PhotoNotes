///<reference path="../declaration/dropbox-sdk.d.ts"/>
///<reference path="../declaration/react-native-fetch-blob.ts"/>
import RNFetchBlob from 'react-native-fetch-blob';
import Dropbox from 'dropbox';
import {DROPBOX_APP_KEY} from "../constants/Config";
import {STORE_KEYS} from "../constants/ActionTypes";
import {AsyncStorage} from "react-native";
import FileMetadataReference = DropboxTypes.files.FileMetadataReference;
import FileMetadata = DropboxTypes.files.FileMetadata;
import FullAccount = DropboxTypes.users.FullAccount;
import ListFolderResult = DropboxTypes.files.ListFolderResult;

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

  async filesList(): Promise<FileMetadataReference[]> {
    const response = await this.getListFiles();
    return response.entries.filter(file => file['.tag'] === 'file') as FileMetadataReference[];
  }

  async getListFiles(): Promise<ListFolderResult> {
    return await this.dbx.filesListFolder({path: ''});
  }
}

export interface IDropboxApiError {
  error: any;
  message: string;
}

function responseError(message, error): IDropboxApiError {
  return {
    message: message,
    error,
  }
}

