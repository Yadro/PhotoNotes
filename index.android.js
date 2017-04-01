import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import AppWithStore from './build/src/index';

AppRegistry.registerComponent('PhotoNotes', () => AppWithStore);

if (console && console.group && console.groupCollapsed) {
  console.group = console.groupCollapsed;
}
