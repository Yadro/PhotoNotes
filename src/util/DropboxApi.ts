//<reference path="../../node_modules/retyped-dropboxjs-tsd-ambient/dropboxjs.d.ts"/>
import {NativeModules, Linking} from 'react-native'
import Dropbox from 'dropbox';

import {DROPBOX_APP_KEY} from "../constants/Config";

export class DropboxApi {
  dropbox;
  token: string;
  redirectUrl: string;

  constructor() {
    this.dropbox = new Dropbox({
      clientId: DROPBOX_APP_KEY
    });
  }

  getAuthenticationUrl(redirectToApp: string): string {
    if (this.redirectUrl) {
      return this.redirectUrl;
    }
    return this.redirectUrl = this.dropbox.getAuthenticationUrl(redirectToApp);
  }

  setToken(token: string) {
    this.token = token;
  }
}

export const dbxApi = new DropboxApi();