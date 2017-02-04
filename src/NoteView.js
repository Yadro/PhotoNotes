import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import PhotoView from 'react-native-photo-view';
import store from "./redux/Store";
import Actions from "./redux/Actions";
import Note from "./Note";

export default class NoteView extends Component {

  static navigationOptions = {
    title: (e) => {
      const id = e.state.params.id;
      const item = store.getState().notes.notes.find(e => e.id == id);
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
    const {notes} = store.getState().notes;
    const {id} = props.navigation.state.params;
    const note: Note = notes.find(e => e.id == id);
    this.state = {
      note,
      size: null,
      image: 'http://www.animalsglobe.ru/wp-content/uploads/2011/09/%D1%81%D0%BE%D0%B2%D0%B0.jpg'
    };
  }

  componentDidMount() {
    Image.getSize(this.state.image, (width, height) => {
      const size = {width, height};
      this.setState({size});
    });
  }

  render() {
    const {size, image} = this.state;
    const {id, title, content} = this.state.note;
    return (
      <ScrollView style={css.container}>
        <Image source={{uri: image}}
               style={size}/>
        <PhotoView
          source={{uri: image}}
          onLoad={() => console.log("onLoad called")}
          onTap={() => console.log("onTap called")}
          minimumZoomScale={0.5}
          maximumZoomScale={3}
          androidScaleType="center"
          style={size}/>
        <Text>Title:</Text>
        <Text>{title}</Text>
        <Text>Content:</Text>
        <Text>{content}</Text>
        <Text>{id}</Text>
      </ScrollView>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'grey',
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
});