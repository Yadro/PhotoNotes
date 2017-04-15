export interface FetchConfig {

}

export interface RNFetchBlobConfig {
  fileCache: boolean,
  path: string,
  appendExt: string,
  session: string,
  addAndroidDownloads: any,
  indicator: boolean
}

export interface RNFetchBlobNative {
  // API for fetch octet-stream data
  fetchBlob: (options: FetchConfig,
              taskId: string,
              method: string,
              url: string,
              headers: any,
              body: any,
              callback: (err: any, ...data: any[]) => void) => void,
  // API for fetch form data
  fetchBlobForm: (options: FetchConfig,
                  taskId: string,
                  method: string,
                  url: string,
                  headers: any,
                  form: Array<any>,
                  callback: (err: any, ...data: any[]) => void) => void,
  // open file stream
  readStream: (path: string,
               encode: 'utf8' | 'ascii' | 'base64') => void,
  // get system folders
  getEnvironmentDirs: (dirs: any) => void,
  // unlink file by path
  unlink: (path: string, callback: (err: any) => void) => void,
  removeSession: (paths: Array<string>, callback: (err: any) => void) => void,
  ls: (path: string, callback: (err: any) => void) => void,
}

export interface RNFetchBlobResponseInfo {
  taskId: string,
  state: number,
  headers: any,
  status: number,
  respType: 'text' | 'blob' | '' | 'json',
  rnfbEncode: 'path' | 'base64' | 'ascii' | 'utf8'
}

export class RNFetchBlobStream {
  onData: () => void;
  onError: () => void;
  onEnd: () => void;
  _onData: () => void;
  _onEnd: () => void;
  _onError: () => void;
}
