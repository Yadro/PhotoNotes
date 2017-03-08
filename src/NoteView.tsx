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
} from 'react-native';
import Toolbar from "./Toolbar";
import PhotoView from 'react-native-photo-view';
import {ScreenNavigationProp} from "react-navigation";
import moment from 'moment';
import store from "./redux/Store";
import Note from "./Note";
import icons from './Icons'
import NoteEdit from "./NoteEdit";
import {Actions} from "./redux/Actions";
import {Markdown} from "./Markdown";
import {getResizedImage} from "./util";
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
  viewSize;
  size;
  image;
  loaded?;
}
export default class NoteView extends Component<ScreenNavigationProp, NoteViewS> {

  constructor(props) {
    super(props);
    const {notes, other: {size}} = store.getState();
    const {id} = props.navigation.state.params;
    const note: Note = notes.find(e => e.id == id);

    if (note.image) {
      getResizedImage(note.image, size).then(({image, size}) => {
        console.log(image, size);
        this.setState({image, size});
      }).catch(e => {
        console.error(e);
      });
    }

    this.state = {
      note,
      viewSize: size,
      size: null,
      image: null,
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

  render() {
    const {navigate} = this.props.navigation;
    const {size, image, note} = this.state;
    const {title, content, createdAt, updatedAt} = note;
    const img = image ? {uri: image} : false;
    return (
      <View style={css.container}>
        <Toolbar title={toolbar.header} actions={toolbarActions} color="white" backgroundColor="#01B47C"
                 navIcon={arrowWhite} onActionSelected={this.onActionSelected}/>
        <ScrollView style={{flex: 1}}>
          <View style={css.header}>
            <Text style={css.title}>{title}</Text>
            <Text style={css.time}>{moment(createdAt || updatedAt).format('lll')}</Text>
          </View>
          <View style={css.textView}>
            <Text style={css.text} selectable>{Markdown.parse(content)}</Text>
          </View>
          {img &&
            <View onTouchEnd={() => navigate('PhotoView', {img: {uri: note.image}})} style={{flex: 1}}>
              <Image source={img} resizeMode="cover" style={size}/>
              {__DEV__ && <Text>{size.width + 'x' + size.height}</Text>}
            </View>
          }
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
    backgroundColor: '#f7f7f7',
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