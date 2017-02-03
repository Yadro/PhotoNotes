
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
import NoteComp from './src/NoteComp';
import NoteView from "./src/NoteView";


const BasicApp = StackNavigator({
  Main: {screen: App},
  NoteComp: {screen: NoteComp},
  NoteView: {screen: NoteView},
});

AppRegistry.registerComponent('PhotoNotes', () => BasicApp);
