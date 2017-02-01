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

  constructor(props) {
    super(props);
    const {currentId, notes} = store.getState();
    const note: Note = notes.find(e => e.id == currentId);
    const {id, title, content, image} = note;
    this.state = {id, title, content, image};
    this.onChange = this.onChange.bind(this);
  }

  onChange(field, text) {
    this.setState({[field]: text});
  }

  render() {
    const {id, title, content} = this.state;
    return (
      <ScrollView style={css.container}>
        <Text>{id}</Text>
        <TextInput value={title}
                   type="text"
                   onChangeText={this.onChange.bind(null, 'title')}/>
        <TextInput value={content}
                   type="text"/>
        <View style={css.buttons}>
          <Button title={'Cancel'} onPress={() => NotesAction.show('list')}/>
          <Button title={'Save'} onPress={() => NotesAction}/>
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
    justifyContent: 'space-between',
  },
});