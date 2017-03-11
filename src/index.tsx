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
import store from "./redux/Store";
import NoteEdit from './NoteEdit';
import NoteView from "./NoteView";
import {ActionOther} from "./redux/Actions";
import NoteList from "./NoteList";
import Threshold from "./Threshold";
import PhotoViewComp from "./PhotoView";
import {tracker} from "./Analytics";
import Search from "./Search";
import Password from "./Password";

const BasicApp = StackNavigator({
  Main: {screen: NoteList},
  Search: {screen: Search},
  Password: {screen: Password},
  NoteEdit: {screen: NoteEdit},
  NoteView: {screen: NoteView},
  PhotoView: {screen: PhotoViewComp},
  Threshold: {screen: Threshold},
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
    return <View style={{flex: 1}}>
      <StatusBar
        backgroundColor="#019967"
        barStyle="light-content"
      />
      <BasicApp/>
    </View>
  }
}