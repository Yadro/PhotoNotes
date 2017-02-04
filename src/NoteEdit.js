import React, {Component} from 'react';
import {
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
import store from "./redux/Store";
import Actions from "./redux/Actions";
import Note from "./Note";

export default class NoteEdit extends Component {

  static navigationOptions = {
    title: 'Note'
  };

  constructor(props) {
    super(props);
    const {notes} = store.getState().notes;
    const params = props.navigation.state.params;
    if (params && params.id != null) {
      const note: Note = notes.find(e => e.id == params.id);
      this.state = {note};
    } else {
      this.state = {note: new Note()}
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(field, text) {
    const {note} = this.state;
    note[field] = text;
    this.setState({note});
  }

  render() {
    const {id, title, content} = this.state.note;
    const { params, navigate } = this.props.navigation;
    return (
      <ScrollView style={css.container}>
        <Text>note id = {id}</Text>
        <Text>Title:</Text>
        <TextInput value={title}
                   type="text"
                   onChangeText={this.onChange.bind(null, 'title')}/>
        <Text>Content:</Text>
        <TextInput value={content}
                   type="text"/>
        <View style={css.buttons}>
          <Button style={css.cancelBtn} title={'Cancel'} onPress={() => navigate('Main')}/>
          <Button style={css.saveBtn} title={'Save'} onPress={() => {
            Actions.update(this.state.note);
            navigate('Main');
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