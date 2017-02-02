
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

import App from './src/App';
import NoteComp from './src/NoteComp';

import {
  StackNavigator,
} from 'react-navigation';


const BasicApp = StackNavigator({
  Main: {screen: App},
  NoteComp: {screen: NoteComp},
});

AppRegistry.registerComponent('PhotoNotes', () => BasicApp);
