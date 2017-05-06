import * as React from 'react';
import {AsyncStorage, Button, Linking, TextInput, View} from "react-native";
import {dbxApi} from "./DropboxNoteApi";
import {STORE_KEYS} from "../constants/ActionTypes";
import {ScreenNavigationProp} from "react-navigation";
import {DropboxApi} from "./DropboxApi";

interface DropboxAuthP extends ScreenNavigationProp {
}
interface DropboxAuthS {
  redirect: string;
  token: string;
}

export class DropboxAuth extends React.Component<DropboxAuthP, DropboxAuthS> {
  dbx: DropboxApi;

  constructor(props) {
    super(props);
    this.state = {
      redirect: '',
      token: '',
    };
    this.dbx = dbxApi;
    AsyncStorage.getItem(STORE_KEYS.accessToken).then(token => {
      if (token) {
        this.setState({token});
      }
    });
  }

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial url is: ' + url);
      }
    }).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this._handleOpenURL);
    const redirect = this.dbx.getAuthenticationUrl('android-app://index/');
    this.setState({redirect});
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL(event) {
    console.log(event.url);
  }

  onLogin = () => {
    const url = this.state.redirect;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  };

  setToken = () => {
    this.dbx.setToken(this.state.token);
    this.dbx.setToken(this.state.token);
    AsyncStorage.setItem(STORE_KEYS.accessToken, this.state.token);
  };

  async uploadTestFile() {
    let result;
    try {
      // const files = await dbxApi.filesListFolder();
      // result = await dbxApi.uploadFile('/file1', 'content');
      result = await dbxApi.downloadFile('/file1');

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View>
        <Button title="Dropbox Login" onPress={this.onLogin} />
        <TextInput value={this.state.token} onChangeText={token => this.setState({token})}/>
        <Button title="Set token" onPress={this.setToken} />
        <Button title="Test" onPress={this.uploadTestFile} />
      </View>
    )
  }
}
