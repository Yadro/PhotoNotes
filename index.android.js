
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  StatusBar,
  Navigator,
} from 'react-native';
import {StackNavigator} from 'react-navigation';

import App from './src/App';
import NoteEdit from './src/NoteEdit';
import NoteView from "./src/NoteView";
import NoteCreate from "./src/NoteCreate";
import {Actions} from "./src/redux/Actions";
import Note from "./src/Note";

/*for (let i = 0; i < 20; i++) {
  Actions.add(new Note('Note', 'content', 'http://www.animalsglobe.ru/wp-content/uploads/2011/09/%D1%81%D0%BE%D0%B2%D0%B0.jpg'));
}*/

const BasicApp = StackNavigator({
  Main: {screen: App},
  NoteEdit: {screen: NoteEdit},
  NoteView: {screen: NoteView},
  NoteCreate: {screen: NoteCreate},
});

AppRegistry.registerComponent('PhotoNotes', () => BasicApp);
