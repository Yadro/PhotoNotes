import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ListView,
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import store, {NotesAction, NoteState} from "./NoteStore";
import Note from "./Note";

export default class NoteComp extends Component {

  static navigationOptions = {
    title: 'Note'
  };

  constructor(props) {
    super(props);
    const {currentId, notes} = store.getState();
    const note: Note = notes.find(e => e.id == currentId);
    this.state = {note};
    this.onChange = this.onChange.bind(this);
  }

  onChange(field, text) {
    const {note} = this.state;
    note[field] = text;
    this.setState({note});
  }

  render() {
    const {id, title, content} = this.state.note;
    return (
      <ScrollView style={css.container}>
        <Text>{id}</Text>
        <TextInput value={title}
                   type="text"
                   onChangeText={this.onChange.bind(null, 'title')}/>
        <TextInput value={content}
                   type="text"/>
        <View style={css.buttons}>
          <Button style={css.cancelBtn} title={'Cancel'} onPress={() => NotesAction.show('list')}/>
          <Button style={css.saveBtn} title={'Save'} onPress={() => {
            NotesAction.update(this.state.note);
            NotesAction.show('list');
          }}/>
        </View>
      </ScrollView>
    );
  }
};

const css = StyleSheet.create({
  container: {
    margin: 10,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    // alignSelf: 'stretch',
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1,
  }
});