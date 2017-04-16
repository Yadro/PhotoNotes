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
  ViewStyle,
} from 'react-native';
import Toolbar from "../components/Toolbar";
import {ScreenNavigationProp} from "react-navigation";
import moment from 'moment';
import Note from "../redux/Note";
import icons, {paths} from '../components/Icons'
import NoteEdit from "./NoteEdit";
import {Markdown} from "../components/Markdown";
import {getResizedImage, getSizePexel, pixelToDimensions} from "../util/util";
import l from '../constants/Localization';
import {tracker} from "../Analytics";
import {gray} from "../constants/theme";
import {connect} from "react-redux";
import {parse} from "../components/SimpleMarkdown";
import {IReduxProp} from "../declaration/types";
import {ActionNote} from "../constants/ActionNote";
const {remove} = l.Alert;
const {toolbar} = l.NoteView;
const {editWhite, shareWhite, arrowWhite, deleteIconWhite, undoWhite} = icons;

const toolbarActions = [
  {title: toolbar.edit, icon: editWhite, show: 'always'},
  {title: toolbar.share, icon: shareWhite, show: 'always'},
  {title: toolbar.del, icon: deleteIconWhite, show: 'always'},
];
const trashActions = [
  {title: 'Восстановить', icon: undoWhite, show: 'always'},
  {title: toolbar.del, icon: deleteIconWhite, show: 'always'},
];

type TypeFromView = 'trash' | 'list';
interface NoteViewP extends ScreenNavigationProp, IReduxProp {
  notes: Note[];
  type?: TypeFromView;
}
interface NoteViewS {
  note;
  image;
  size: {width, height};
  isLoad;
  type: TypeFromView;
}
class NoteView extends Component<NoteViewP, NoteViewS> {
  toolbarActions;
  callbackActions;

  constructor(props: NoteViewP) {
    super(props);
    const {dispatch, navigation} = props;
    const {id, type} = navigation.state.params;
    const fromTrash = type == 'trash';
    if (fromTrash) {
      this.toolbarActions = toolbarActions;
      this.callbackActions = [() => {
        dispatch(ActionNote.restore(this.state.note.id));
        this.props.navigation.dispatch(NoteEdit.resetAction);
      }];
    } else {
      this.toolbarActions = trashActions;
      this.callbackActions = [
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
      ];
    }
    this.callbackActions.push(this.onDelete);

    const note: Note = props.notes.find(e => e.id == id);

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
      type,
    };
    if (!__DEV__) tracker.trackScreenView('NoteView');
  }

  onDelete = () => {
    Alert.alert(remove.title, remove.subtitle, [{
      text: remove.buttons.cancel,
      onPress: () => {}
    }, {
      text: remove.buttons.remove,
      onPress: () => {
        const {dispatch, navigation} = this.props;
        dispatch(ActionNote.remove(this.state.note.id));
        navigation.dispatch(NoteEdit.resetAction);
      }
    }], {cancelable: true});
  };

  onActionSelected = (action) => {
    if (action == null) {
      this.props.navigation.goBack();
    } else {
      this.callbackActions[action] && this.callbackActions[action]();
    }
  };

  onImageLoad = () => {
    this.setState({isLoad: true});
  };

  render() {
    const {type} = this.state;
    const fromTrash = type == 'trash';
    const {navigate} = this.props.navigation;
    const {image, note, size, isLoad} = this.state;
    const {title, content, createdAt, updatedAt, tags} = note;
    const img = image ? {uri: image} : false;
    return (
      <View style={css.container}>
        <Toolbar title={toolbar.header} actions={fromTrash ? trashActions : toolbarActions} color="white" backgroundColor="#01B47C"
                 navIcon={arrowWhite} onActionSelected={this.onActionSelected}/>
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={css.header}>
            <View style={css.headerContainer}>
              <View style={css.titleContainer}>
                <Text style={css.title} numberOfLines={1}>{title}</Text>
              </View>
              <View style={css.label}>
                <Image
                  source={{uri: paths.labelBlack}}
                  style={{width: 24, height: 24, marginRight: 4}}
                  tintColor={gray}
                />
                <Text>{tags.length}</Text>
              </View>
            </View>
            <Text style={css.time}>{moment(updatedAt || createdAt).format('lll')}</Text>
          </View>
          <View style={css.textView}>
            {parse(content)}
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
export default connect(state => {
  return {
    notes: state.notes
  };
})(NoteView);

const css = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderColor: '#ebebeb',
    borderBottomWidth: 1,
    backgroundColor: '#f7f7f7',
  } as ViewStyle,
  headerContainer: {
    flexDirection: 'row',
  } as ViewStyle,
  titleContainer: {
    flex: 1,
    paddingRight: 5,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center'
  } as ViewStyle,
  time: {
    color: 'black',
    textAlign: 'right',
    fontSize: 10,
    paddingBottom: 10,
  } as TextStyle,

  textView: {
    margin: 16,
  },
  text: {
    fontSize: 17,
    color: 'black',
  },
});