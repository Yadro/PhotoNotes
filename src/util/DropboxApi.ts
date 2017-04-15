///<reference path="../declaration/dropbox-sdk.d.ts"/>
import RNFetchBlob from 'react-native-fetch-blob';
import Dropbox from 'dropbox';
import FileMetadataReference = DropboxTypes.files.FileMetadataReference;
import FileMetadata = DropboxTypes.files.FileMetadata;
import {DROPBOX_APP_KEY} from "../constants/Config";
import {STORE_KEYS} from "../constants/ActionTypes";
import {AsyncStorage} from "react-native";

export class DropboxApi {
  dbx: DropboxTypes.Dropbox;
  redirectUrl: string;

  constructor() {
    this.dbx = new Dropbox({
      clientId: DROPBOX_APP_KEY
    });
    AsyncStorage.getItem(STORE_KEYS.accessToken).then(token => {
      if (token) {
        this.setToken(token);
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

  async uploadFile(path: string, contents: string): Promise<FileMetadata> {
    try {
      const result = await RNFetchBlob.fetch('POST', 'https://content.dropboxapi.com/2/files/upload', {
        Authorization: 'Bearer ' + this.dbx.getAccessToken(),
        'Dropbox-API-Arg': JSON.stringify({path}),
        'Content-Type': 'text/plain; charset=dropbox-cors-hack',
      }, contents);
      return JSON.parse(result.data);
    } catch (err) {
      return err;
    }
  }

  async downloadFile(path: string): Promise<FileMetadata> {
    try {
      const result = await RNFetchBlob.fetch('POST', 'https://content.dropboxapi.com/2/files/download', {
        Authorization: 'Bearer ' + this.dbx.getAccessToken(),
        'Dropbox-API-Arg': JSON.stringify({path}),
        'Content-Type': ' ',
      });
      return result.data;
    } catch (err) {
      return err;
    }
  }

  async getListFiles() {
    try {
      const result = await this.dbx.filesListFolder({path: ''});
      console.log(result);
      return result.entries.filter(file => file['.tag'] === 'file').map((file: FileMetadataReference) => {
        return {
          file: file.name,
          client_modified: file.client_modified,
          content_hash: file.content_hash,
        }
      })
    } catch (err) {
      console.log(err.message);
    }
  }
}

export const dbxApi = new DropboxApi();