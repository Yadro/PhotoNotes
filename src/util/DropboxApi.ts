///<reference path="../declaration/dropbox-sdk.d.ts"/>
import {NativeModules, Linking} from 'react-native'
import Dropbox from 'dropbox';

import {DROPBOX_APP_KEY} from "../constants/Config";

export class DropboxApi {
  dbx: DropboxTypes.Dropbox;
  token: string;
  redirectUrl: string;

  constructor() {
    this.dbx = new Dropbox({
      clientId: DROPBOX_APP_KEY
    });
  }

  getAuthenticationUrl(redirectToApp: string): string {
    if (this.redirectUrl) {
      return this.redirectUrl;
    }
    return this.redirectUrl = this.dbx.getAuthenticationUrl(redirectToApp);
  }

  setToken(token: string) {
    this.token = token;
  }

  async uploadFile() {
    try {
      const result = await this.dbx.filesUpload({
        contents: {},
        path: './test.txt'
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export const dbxApi = new DropboxApi();