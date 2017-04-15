import * as React from 'react';
import {Button, Linking, Navigator, TextInput, View} from "react-native";
import {dbxApi, DropboxApi} from "./DropboxApi";

interface DropboxAuthP {
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
  }

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial url is: ' + url);
      }
    }).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this._handleOpenURL);

    const redirect = this.dbx.getAuthenticationUrl('android-app://index/');
    console.log(redirect);
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
  };

  render() {
    return (
      <View>
        <Button title="Dropbox Login" onPress={this.onLogin} />
        <TextInput value={this.state.token} onChangeText={token => this.setState({token})}/>
        <Button title="Set token" onPress={this.setToken} />
      </View>
    )
  }
}
