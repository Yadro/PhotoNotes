
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


const BasicApp = StackNavigator({
  Main: {screen: App},
  NoteEdit: {screen: NoteEdit},
  NoteView: {screen: NoteView},
  NoteCreate: {screen: NoteCreate},
});

AppRegistry.registerComponent('PhotoNotes', () => BasicApp);
