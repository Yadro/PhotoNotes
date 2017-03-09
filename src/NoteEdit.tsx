import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  ScrollView,
  Platform,
  Clipboard,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import store from "./redux/Store";
import {Actions} from "./redux/Actions";
import Note from "./Note";
import {NavigationActions} from "react-navigation";
import {ScreenNavigationProp} from "react-navigation";
import Toolbar from "./Toolbar";
import icons from './Icons'
import AutoExpandingTextInput from "./AutoExpandingTextInput";
import {getResizedImage, pixelToDimensions, getSizePexel} from "./util";
import {InputSelection} from "./AutoExpandingTextInput";
import {tracker} from './Analytics';
import moment from 'moment';
import l from './Localization';
const {remove} = l.Alert;
const {toolbar, editor, window} = l.NoteEdit;
const {
  checkWhite, addPhotoWhite, shareWhite, deleteIconWhite,
  boldWhite, italicWhite, underWhite, listBulletWhite, titleWhite, pastWhite, timeWhite,
  undoWhite, redoWhite
} = icons;

const toolbarActions = [
  {title: toolbar.picker, icon: addPhotoWhite, show: 'always'},
  {title: toolbar.share, icon: shareWhite, show: 'always'},
];

const tools = [
  /*{title: 'Undo', icon: undoWhite, show: 'always'},
   {title: 'Redo', icon: redoWhite, show: 'always'},*/
  {title: editor.past, icon: pastWhite, show: 'always'},
  {title: editor.timestamp, icon: timeWhite, show: 'always'},
  {title: editor.bold, icon: boldWhite, show: 'always'},
  {title: editor.italic, icon: italicWhite, show: 'always'},
  {title: editor.underline, icon: underWhite, show: 'always'},
  {title: editor.list, icon: listBulletWhite, show: 'always'},
  {title: editor.header, icon: titleWhite, show: 'always'},
];

interface NoteEditS {
  note?: Note;
  size?;
  isLoad;
  actions?;
  save?;
  image?;
  selection?;
}

export default class NoteEdit extends Component<ScreenNavigationProp, NoteEditS> {
  static resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({routeName: 'Main'})
    ]
  });

  constructor(props) {
    super(props);
    const {notes} = store.getState();
    const {params} = props.navigation.state;
    const actions = toolbarActions.slice();
    if (params) {
      if (params.note) {
        // from threshold
        // fixme
        const note = params.note;
        if (note.image) {
          getResizedImage(note.image, getSizePexel()).then(({image, size}) => {
            this.setState({image, size: pixelToDimensions(size)});
          }).catch(e => {
            console.error(e);
          });
        }
        this.state = {
          note: Object.assign({}, params.note),
          size: null,
          actions,
          selection: {start: 0, end: 0},
        };
      } else if (params.id) {
        // from list
        const note = Object.assign({},
          notes.find(e => e.id == params.id)
        );
        if (note.image) {
          // fixme
          getResizedImage(note.image, getSizePexel()).then(({image, size}) => {
            this.setState({image, size: pixelToDimensions(size)});
          }).catch(e => {
            console.error(e);
          });
        }
        actions.push({title: toolbar.remove, icon: deleteIconWhite, show: 'always'});
        this.state = {
          note,
          size: null,
          actions,
          save: true,
          selection: {start: 0, end: 0},
        };
      }
    }
    else {
      // create new
      this.state = {
        note: new Note(),
        size: null,
        actions,
        selection: {start: 0, end: 0},
      };
    }
    tracker.trackScreenView('NoteEdit');
  }

  showPicker = () => {
    ImagePicker.showImagePicker({storageOptions: true}, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source; // = {uri: 'data:image/jpeg;base64,' + response.data};
        if (Platform.OS === 'android') {
          source = {uri: response.uri};
        } else {
          source = {uri: response.uri.replace('file://', '')};
        }
        const {note} = this.state;
        note.originalImage = source.uri;
        this.props.navigation.navigate('Threshold', {src: response.path, note});
      }
    });
  };

  onChange = (field, data) => {
    const {note} = this.state;
    note[field] = data;
    this.setState({note});
  };

  onMultiLineInput = (data) => {
    const {note} = this.state;
    note.content = data.value;
    this.setState({
      note,
      selection: data.selection,
    });
  };

  onSave = () => {
    const {note, save} = this.state;
    Actions[save ? 'update' : 'add'](note);
    // this.props.navigation.goBack();
    this.props.navigation.dispatch(NoteEdit.resetAction);
    tracker.trackEvent('Note', 'New');
  };

  onDelete = () => {
    Alert.alert(remove.title, remove.subtitle, [{
      text: remove.buttons.cancel,
      onPress: () => {}
    }, {
      text: remove.buttons.remove,
      onPress: () => {
        Actions.remove(this.state.note.id);
        this.props.navigation.dispatch(NoteEdit.resetAction);
        tracker.trackEvent('Note', 'Remove');
      }
    }], {cancelable: true});
  };

  onActionSelected = (action) => {
    const actions = [
      this.showPicker,
      () => {
        const {title, content} = this.state.note;
        Share.share({
          title,
          message: `${title}\n${content}`,
        }, {});
      },
      this.onDelete,
    ];
    actions[action] && actions[action]();
  };

  renderToolBar = () =>
    <Toolbar title={toolbar.header} actions={this.state.actions}
             color="white" backgroundColor="#01B47C" navIcon={checkWhite}
             onIconClicked={this.onSave}
             onActionSelected={this.onActionSelected}/>;

  onToolAction = (action) => {
    const {note, selection} = this.state;
    const actions = [
      /*null,
       null,*/
      () => {
        Clipboard.getString().then(text => {
          note.content = past(note.content, selection, {start: '', end: text});
          this.setState({note});
        });
      },
      () => {
        note.content = past(note.content, selection, {start: '', end: moment().format('YYYY.MM.DD hh:mm ')});
        this.setState({note});
      },
      () => {
        note.content = past(note.content, selection, {start: '*', end: '*'});
        this.setState({note});
      }, () => {
        note.content = past(note.content, selection, {start: '_', end: '_'});
        this.setState({note});
      }, () => {
        note.content = past(note.content, selection, {start: '~~', end: '~~'});
        this.setState({note});
      }, () => {
        note.content = past(note.content, selection, {start: '', end: '\n- '});
        this.setState({note});
      }, () => {
        note.content = past(note.content, selection, {start: '', end: '# '});
        this.setState({note});
      }
    ];
    actions[action] && actions[action]();
    tracker.trackEvent('Note', 'Use toolbar');
  };

  renderTools = () =>
    <Toolbar actions={tools} color="white" backgroundColor="#01B47C"
             onActionSelected={this.onToolAction}/>;

  onImageLoad = () => {
    this.setState({isLoad: true});
  };

  render() {
    const {note, size, isLoad} = this.state;
    const {title, content, image} = note;
    const {navigate} = this.props.navigation;
    const img = image && size ? {uri: image} : false;
    return (
      <View style={css.container}>
        {this.renderToolBar()}
        <ScrollView style={css.container}>
          <View style={css.textBox}>
            <TextInput value={title} style={css.text} placeholder={window.title}
                       blurOnSubmit={false} returnKeyType="next"
                       onChangeText={this.onChange.bind(null, 'title')}/>
            <AutoExpandingTextInput value={content} style={css.textMultiLine}
                                    placeholder={window.content} autoCapitalize="sentences"
                                    onChangeText={this.onMultiLineInput}
                                    underlineColorAndroid='transparent'/>
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
        {this.renderTools()}
      </View>
    );
  }
};

function past(text: string, selection: InputSelection, past: {start: string, end: string}) {
  if (selection.start == selection.end) {
    return text.substring(0, selection.start) + past.end + text.substring(selection.start);
  }
  return text.substring(0, selection.start) +
    past.start + text.substring(selection.start, selection.end) +
    past.end + text.substring(selection.end);
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textBox: {
    margin: 10,
  },
  text: {
    fontSize: 15,
    height: 36,
  },
  textMultiLine: {
    fontSize: 15,
  },
});