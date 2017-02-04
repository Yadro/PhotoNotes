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
import {Actions} from "./redux/Actions";
import Note from "./Note";

export default class NoteView extends Component<any, any> {

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
    const state = store.getState();
    const {notes} = state.notes;
    const {size} = state.other;
    const {id} = props.navigation.state.params;
    const note: Note = notes.find(e => e.id == id);
    this.state = {
      note,
      viewSize: size,
      size: null,
      image: 'http://www.animalsglobe.ru/wp-content/uploads/2011/09/%D1%81%D0%BE%D0%B2%D0%B0.jpg'
    };
  }

  componentDidMount() {
    const {image, viewSize} = this.state;
    Image.getSize(this.state.image, (width, height) => {
      const size = {
        width: Math.min(viewSize.width, width),
        height
      };
      this.setState({size});
    });
  }

  render() {
    const {size, viewSize} = this.state;
    const {id, title, content, image} = this.state.note;
    return (
      <ScrollView style={css.container}>
        <PhotoView
          source={{uri: image}}
          onLoad={() => console.log("onLoad called")}
          onTap={() => console.log("onTap called")}
          minimumZoomScale={1}
          maximumZoomScale={4}
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
    // backgroundColor: 'grey',
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