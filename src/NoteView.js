import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import PhotoView from 'react-native-photo-view';
import store, {NotesAction} from "./NoteStore";
import Note from "./Note";

export default class NoteView extends Component {

  static navigationOptions = {
    title: (e) => {
      const id = e.state.params.id;
      const item = store.getState().notes.find(e => e.id == id);
      return item && item.title;
    },
    header: (e) => {
      return {
        right: <Button title={'edit'} onPress={() => null}/>
      }
    },
  };

  constructor(props) {
    super(props);
    const {notes} = store.getState();
    const {id} = props.navigation.state.params;
    const note: Note = notes.find(e => e.id == id);
    this.state = {note};
  }

  render() {
    const {id, title, content} = this.state.note;
    return (
      <View>
        <PhotoView
          source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
          onLoad={() => console.log("onLoad called")}
          onTap={() => console.log("onTap called")}
          minimumZoomScale={0.5}
          maximumZoomScale={3}
          androidScaleType="center"
          style={css.photo}/>
        <Text>{content}</Text>
        <Text>{id}</Text>
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  item: {
    padding: 20,
    fontSize: 17,
    color: 'black',
  },
  text: {
    backgroundColor: "transparent",
    color: "#FFF",
  },
  photo: {
    width: 300,
    height: 300,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});