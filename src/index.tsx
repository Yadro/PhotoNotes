import * as React from 'react';
import {Component} from 'react';
import {
  View,
  StatusBar,
  PixelRatio,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
} from 'react-navigation';
import {Provider, connect} from 'react-redux'
import store from "./redux/Store";
import NoteEdit from './screens/NoteEdit';
import NoteView from "./screens/NoteView";
import {ActionOther} from "./redux/Actions";
import NoteList from "./screens/NoteList";
import Threshold from "./screens/Threshold";
import PhotoViewComp from "./screens/PhotoView";
import {tracker} from "./Analytics";
import Search from "./screens/Search";
import Password from "./screens/Password";
import Settings from "./screens/Settings";

const App = StackNavigator({
  Main: {screen: NoteList},
  Search: {screen: Search},
  NoteEdit: {screen: NoteEdit},
  NoteView: {screen: NoteView},
  PhotoView: {screen: PhotoViewComp},
  Threshold: {screen: Threshold},
  Settings: {screen: Settings},
  Password: {screen: Password},
}, {
  headerMode: 'none'
});

export default class AppWithStore extends Component<any, any> {

  constructor(props) {
    super(props);
    console.log('App start');
    if (!__DEV__) tracker.trackScreenView('Home');
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <StatusBar
            backgroundColor="#019967"
            barStyle="light-content"
          />
          <App/>
        </View>
      </Provider>
    )
  }
}