import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import Toolbar from "./Toolbar";
import PhotoView from 'react-native-photo-view';
import {ScreenNavigationProp} from "react-navigation";
import store from "./redux/Store";
import Note from "./Note";
import icons from './Icons'
const {edit, share, arrow} = icons;

const toolbarActions = [
  {title: 'Edit', icon: edit, show: 'always'},
  {title: 'Share', icon: share, show: 'always'},
];

export default class NoteView extends Component<ScreenNavigationProp, any> {

  constructor(props) {
    super(props);
    const {notes, other: {size}} = store.getState();
    const {id} = props.navigation.state.params;
    const note: Note = notes.find(e => e.id == id);
    this.state = {
      note,
      viewSize: size,
      size: null
    };
  }

  componentDidMount() {
    const {viewSize, note: {image}} = this.state;
    const screenWidth = viewSize.width;
    Image.getSize(image, (width, height) => {
      const delta = Math.abs((screenWidth - width) / width * 100);
      const size = {
        width: screenWidth,
        height: height - height / 100 * delta,
      };
      this.setState({size});
    }, () => {});
  }

  onActionSelected = (action) => {
    const actions = [
      () => {
        const {state: {params: {id}}, navigate} = this.props.navigation;
        navigate('NoteEdit', {id});
      },
      () => {},
    ];
    if (action == null) {
      this.props.navigation.goBack();
    } else {
      actions[action] && actions[action]();
    }
  };

  render() {
    const {navigate} = this.props.navigation;
    const {size} = this.state;
    const {title, content, image} = this.state.note;
    const img = {uri: image};
    return (
      <View style={css.container}>
        <Toolbar title="Note" actions={toolbarActions} color="white" backgroundColor="#01B47C"
                 navIcon={arrow} onActionSelected={this.onActionSelected}/>
        <ScrollView style={{flex: 1}}>
          <Text style={css.title}>{title}</Text>
          <View style={css.titleLine}/>
          <View style={css.textView}>
            <Text style={css.text} selectable>{content}</Text>
          </View>
          <View onTouchEnd={() => navigate('PhotoView', {img: {uri: image}})} style={{flex: 1}}>
            <Image source={img}
                   resizeMode="cover"
                   style={size}/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    padding: 15,
    color: 'black',
    backgroundColor: '#f7f7f7',
  },
  titleLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ebebeb',
  },
  textView: {
    margin: 15,
  },
  text: {
    fontSize: 17,
    color: 'black',
  },
});