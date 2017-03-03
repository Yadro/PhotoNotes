import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
  ToolbarAndroid,
} from 'react-native';
import PhotoView from 'react-native-photo-view';
import store from "./redux/Store";
import {Actions} from "./redux/Actions";
import Note from "./Note";
import Toolbar from "./Toolbar";
const nativeImageSource = require('nativeImageSource');

export default class NoteView extends Component<any, any> {

  static navigationOptions = {
    header: {
      visible: false,
    }
  };

  constructor(props) {
    super(props);
    const {notes, other: {size}} = store.getState();
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
    const {viewSize, note: {image}} = this.state;
    Image.getSize(image, (width, height) => {
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
      <View style={css.container}>
        <Toolbar title="Note" actions={toolbarActions} color="white" backgroundColor="#01B47C"/>
        <ScrollView style={css.container}>
          <Text style={css.title}>{title}</Text>
          <View style={css.textView}>
            <Text style={css.text} selectable>{content}</Text>
            <Text style={css.text}>{id}</Text>
          </View>

          <PhotoView
            source={{uri: image}}
            onLoad={() => console.log("onLoad called")}
            onTap={() => console.log("onTap called")}
            minimumZoomScale={1}
            maximumZoomScale={4}
            androidScaleType="center"
            style={size}/>
        </ScrollView>
      </View>
    );
  }
}

var toolbarActions = [
  {title: 'Create', show: 'always'},
  {title: 'Filter'},
  {title: 'Settings', show: 'always'},
];

const css = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#01B47C',
    height: 56,
  },
  title: {
    fontSize: 20,
    padding: 15,
    color: 'black',
    backgroundColor: '#f7f7f7',
  },
  textView: {
    margin: 15,
  },
  text: {
    fontSize: 17,
    color: 'black',
  },
  titleLine: {
    flex: 1,
    height: 1,
    marginBottom: 10,
    backgroundColor: '#c9c9c9',
  },
});