import * as React from 'react';
import {Component} from 'react';
import {
  View,
  StatusBar,
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

const BasicApp = StackNavigator({
  Main: {screen: NoteList},
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
    tracker.trackScreenView('Home');
  }

  onLayout(event) {
    const {size} = store.getState().other;
    if (!size) {
      const {x, y, width, height} = event.nativeEvent.layout;
      ActionOther.setViewSize({width: width + x, height: height + y});
    }
  }

  render() {
    return <View style={{flex: 1}} onLayout={this.onLayout}>
      <StatusBar
        backgroundColor="#019967"
        barStyle="light-content"
      />
      <BasicApp/>
    </View>
  }
}