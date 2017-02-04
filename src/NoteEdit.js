import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  ListView,
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import store from "./redux/Store";
import {Actions} from "./redux/Actions";
import Note from "./Note";

export default class NoteEdit extends Component {

  static navigationOptions = {
    title: 'NoteEdit'
  };

  constructor(props) {
    super(props);
    const {notes} = store.getState().notes;
    const params = props.navigation.state.params;
    if (params && params.id != null) {
      const note: Note = notes.find(e => e.id == params.id);
      this.state = {note, id: params.id};
    } else {
      this.state = {
        note: new Note(),
        id: null,
        size: null
      };
    }
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const {other} = store.getState();
    Image.getSize(this.state.note.image, (width, height) => {
      const size = {
        width: other.size.width,
        height,
      };
      this.setState({size});
    });
  }

  onChange(field, text) {
    const {note} = this.state;
    note[field] = text;
    this.setState({note});
  }

  render() {
    const {note, id, size} = this.state;
    const {title, content, image} = note;
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={css.container}>
        <Image source={{uri: image}} style={size}/>
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
            if (!this.state.id) {
              Actions.add(note);
            } else {
              Actions.update(note);
            }
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
    margin: 5,
  },
  saveBtn: {
    flex: 1,
    margin: 5,
  }
});