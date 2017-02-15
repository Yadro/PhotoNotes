import * as React from 'react';
import {Component} from 'react';
import {View} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
} from 'react-navigation';
import store from "./redux/Store";
import NoteEdit from './NoteEdit';
import NoteView from "./NoteView";
import NoteCreate from "./NoteCreate";
import {ActionOther} from "./redux/Actions";
import NoteList from "./NoteList";
import MyPhotoView from "./PhotoView";

const BasicApp = StackNavigator({
  Main: {screen: NoteList},
  NoteEdit: {screen: NoteEdit},
  NoteView: {screen: NoteView},
  NoteCreate: {screen: NoteCreate},
  MyPhotoView: {screen: MyPhotoView},
});

export default class AppWithStore extends Component<any, any> {

  constructor(props) {
    super(props);
    // this.state = store.getState().other;
    console.log('App start');
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
      <BasicApp/>
    </View>
  }
}