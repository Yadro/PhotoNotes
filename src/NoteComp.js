import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import NoteStorage from "./NoteStorage";
import Note from "./Note";

export default class NoteComp extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ScrollView>
        <Text>{'this.props.note.title'}</Text>
      </ScrollView>
    );
  }
};