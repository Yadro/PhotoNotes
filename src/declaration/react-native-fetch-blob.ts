declare module 'react-native-fetch-blob' {
  export default class RNFetchBlob {
    static fetch(method, url, head?, content?): Promise<RNFetchBlobResponse>;
  }
}

interface FetchConfig {

}

interface RNFetchBlobResponse {
  data: any;
  base64(): string;
  json(): any;
  text(): string;
  path(): string;
  readFile<T>(encoding: string): Promise<T>;
  readStream<T>(encoding: string, bufferSize: number): Promise<T>;
  session(name: string);
  info(): RNFetchBlobResponseInfo;
}

interface RNFetchBlobSession {

}

interface RNFetchBlobConfig {
  fileCache: boolean,
  path: string,
  appendExt: string,
  session: string,
  addAndroidDownloads: any,
  indicator: boolean
}

interface RNFetchBlobNative {
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

interface RNFetchBlobResponseInfo {
  taskId: string;
  state: string;
  headers: any;
  status: number; // 200 / 400
  respType: 'text' | 'blob' | '' | 'json';
  rnfbEncode: 'path' | 'base64' | 'ascii' | 'utf8';
}

class RNFetchBlobStream {
  onData: () => void;
  onError: () => void;
  onEnd: () => void;
  _onData: () => void;
  _onEnd: () => void;
  _onError: () => void;
}
