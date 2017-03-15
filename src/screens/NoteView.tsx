import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  Share,
  TextStyle,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Toolbar from "../components/Toolbar";
import {ScreenNavigationProp} from "react-navigation";
import moment from 'moment';
import store from "../redux/Store";
import Note from "../redux/Note";
import icons from '../components/Icons'
import NoteEdit from "./NoteEdit";
import {Actions} from "../redux/Actions";
import {Markdown} from "../components/Markdown";
import {getResizedImage, getSizePexel, pixelToDimensions} from "../util/util";
import l from './Localization';
const {remove} = l.Alert;
const {toolbar} = l.NoteView;
const {editWhite, shareWhite, arrowWhite, deleteIconWhite} = icons;

const toolbarActions = [
  {title: toolbar.edit, icon: editWhite, show: 'always'},
  {title: toolbar.share, icon: shareWhite, show: 'always'},
  {title: toolbar.del, icon: deleteIconWhite, show: 'always'},
];

interface NoteViewS {
  note;
  image;
  size: {width, height};
  isLoad;
}
export default class NoteView extends Component<ScreenNavigationProp, NoteViewS> {

  constructor(props) {
    super(props);
    const {notes} = store.getState();
    const {id} = props.navigation.state.params;
    const note: Note = notes.find(e => e.id == id);

    if (note.image) {
      getResizedImage(note.image, getSizePexel()).then(({image, size}) => {
        this.setState({image, size: pixelToDimensions(size)});
      }).catch(e => {
        console.error(e);
      });
    }

    this.state = {
      note,
      size: null,
      image: null,
      isLoad: false,
    };
  }

  onDelete = () => {
    Alert.alert(remove.title, remove.subtitle, [{
      text: remove.buttons.cancel,
      onPress: () => {}
    }, {
      text: remove.buttons.remove,
      onPress: () => {
        Actions.remove(this.state.note.id);
        this.props.navigation.dispatch(NoteEdit.resetAction);
      }
    }], {cancelable: true});
  };

  onActionSelected = (action) => {
    const actions = [
      () => {
        const {state: {params: {id}}, navigate} = this.props.navigation;
        navigate('NoteEdit', {id});
      },
      () => {
        const {title, content} = this.state.note;
        Share.share({
          title,
          message: `${title}\n${content}`,
        }, {});
      },
      this.onDelete,
    ];
    if (action == null) {
      this.props.navigation.goBack();
    } else {
      actions[action] && actions[action]();
    }
  };

  onImageLoad = () => {
    this.setState({isLoad: true});
  };

  render() {
    const {navigate} = this.props.navigation;
    const {image, note, size, isLoad} = this.state;
    const {title, content, createdAt, updatedAt} = note;
    const img = image ? {uri: image} : false;
    return (
      <View style={css.container}>
        <Toolbar title={toolbar.header} actions={toolbarActions} color="white" backgroundColor="#01B47C"
                 navIcon={arrowWhite} onActionSelected={this.onActionSelected}/>
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={css.header}>
            <Text style={css.title}>{title}</Text>
            <Text style={css.time}>{moment(updatedAt || createdAt).format('lll')}</Text>
          </View>
          <View style={css.textView}>
            <Text style={css.text} selectable>{Markdown.parse(content)}</Text>
          </View>
          {img &&
            <View onTouchEnd={() => navigate('PhotoView', {img: {uri: note.image}})}>
              <Image source={img} resizeMode="contain"
                     style={{width: size.width, height: size.height}}
                     onLoadEnd={this.onImageLoad}/>
            </View>
          }
          {!!note.image && !isLoad && <ActivityIndicator animating size="large"/>}
        </ScrollView>
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#ebebeb',
    borderBottomWidth: 1,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  time: {
    color: 'black',
    textAlign: 'right',
    fontSize: 10,
    paddingBottom: 10,
  } as TextStyle,

  textView: {
    margin: 15,
  },
  text: {
    fontSize: 17,
    color: 'black',
  },
});