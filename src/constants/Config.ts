export const DROPBOX_SECRET_API_KEY = require('../../../dropbox-api-key.json').secret_key;
export const DROPBOX_APP_KEY = require('../../../dropbox-api-key.json').app_key;

export const version = '1.0.5 (beta)';
export const delay = __DEV__ && 3500 || 1000;

export const downloadUrl = 'https://github.com/Yadro/PhotoNotes/releases';
export const emailSend = 'mailto:yadrowork@gmail.com?subject=Developer&';
export const emailSendFeedback = emailSend + 'body=';
export const emailSendThx = emailSend + 'body=Спасибо за приложение :)';

