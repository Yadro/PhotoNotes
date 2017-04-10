import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet, View, Image, TextInput, ScrollView, Platform, Clipboard, Alert, Share, ActivityIndicator
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import store from "../redux/Store";
import {Actions} from "../redux/Actions";
import Note from "../redux/Note";
import {NavigationActions} from "react-navigation";
import {ScreenNavigationProp} from "react-navigation";
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons'
import AutoExpandingTextInput from "../components/AutoExpandingTextInput";
import {getResizedImage, pixelToDimensions, getSizePexel} from "../util/util";
import {InputSelection} from "../components/AutoExpandingTextInput";
import {tracker} from '../Analytics';
import moment from 'moment';
import l from '../constants/Localization';
import {connect} from "react-redux";
import {Filter, selectCurrentFilter, selectFilter} from "../reducers/filter";
import {EditBar} from "../components/EditBar";
const {remove} = l.Alert;
const {toolbar, editor, window} = l.NoteEdit;
const {
  checkWhite, addPhotoWhite, shareWhite, deleteIconWhite, moreWhite,
  pastBlack, timeBlack, boldBlack, italicBlack, underBlack, listBulletBlack, titleBlack,
  labelWhite,
} = icons;


const tools = [
  /*{title: 'Undo', icon: undoWhite, show: 'always'},
   {title: 'Redo', icon: redoWhite, show: 'always'},*/
  {title: editor.past, icon: pastBlack, show: 'always'},
  {title: editor.timestamp, icon: timeBlack, show: 'always'},
  {title: editor.bold, icon: boldBlack, show: 'always'},
  {title: editor.italic, icon: italicBlack, show: 'always'},
  {title: editor.underline, icon: underBlack, show: 'always'},
  {title: editor.list, icon: listBulletBlack, show: 'always'},
  {title: editor.header, icon: titleBlack, show: 'always'},
];


interface NoteEditP extends ScreenNavigationProp {
  notes: Note[];
  currentFilter: Filter;
}

interface NoteEditS {
  note?: Note;
  size?;
  isLoad;
  save?;
  image?;
  selection?;
  editorFocus;
}

class NoteEdit extends Component<NoteEditP, NoteEditS> {
  static resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({routeName: 'Main'})
    ]
  });

  static toolbarActionDelete = {
    title: toolbar.remove, icon: deleteIconWhite, show: 'never',
    onPress: function () {
      this.onDelete()
    }
  };
  toolbarActions = [{
    title: 'tags', icon: labelWhite, show: 'always',
    onPress: function () {
      this.props.navigation.navigate('NoteTags', {note: this.state.note});
    }
  }, {
    title: toolbar.picker, icon: addPhotoWhite, show: 'never',
    onPress: function () {
      this.showPicker();
    }
  }, {
    title: toolbar.share, icon: shareWhite, show: 'never',
    onPress: function () {
      const {title, content} = this.state.note;
      Share.share({
        title,
        message: `${title}\n${content}`,
      }, {});
    }
  }];

  constructor(props: NoteEditP) {
    super(props);
    const {params} = props.navigation.state;
    let note, state, isCreateNew = false;
    if (params) {
      if (params.note) {
        // from threshold
        note = params.note;
      } else if (params.id) {
        // from list
        note = Note.createInstance(props.notes.find(e => e.id == params.id) || {});
        this.toolbarActions.push(NoteEdit.toolbarActionDelete);
        state = {save: true};
      }
    } else {
      // create new
      note = new Note();
      isCreateNew = true;
    }
    if (note.image) {
      // fixme
      getResizedImage(note.image, getSizePexel()).then(({image, size}) => {
        this.setState({image, size: pixelToDimensions(size)});
      }).catch(e => {
        console.error(e);
      });
    }

    const currentFilter = props.currentFilter;
    if (currentFilter.type == 'white' && isCreateNew) {
      note.tags = Object.assign({}, currentFilter.tags);
    }

    this.state = Object.assign({}, state, {
      note,
      size: null,
      selection: {start: 0, end: 0},
      editorFocus: false,
    });
    if (!__DEV__) tracker.trackScreenView('NoteEdit');
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

  setFocus = (editorFocus) => this.setState({editorFocus});

  onFocus = () => this.setFocus(true);

  onBlur = () => this.setFocus(false);

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
    if (save) {
      Actions.update(note);
    } else {
      note.title = note.title || moment().format('YYYY-MM-DD');
      Actions.add(note);
    }
    // this.props.navigation.goBack();
    this.props.navigation.dispatch(NoteEdit.resetAction);
  };

  onDelete = () => {
    Alert.alert(remove.title, remove.subtitle, [{
      text: remove.buttons.cancel,
      onPress: () => {
      }
    }, {
      text: remove.buttons.remove,
      onPress: () => {
        Actions.remove(this.state.note.id);
        this.props.navigation.dispatch(NoteEdit.resetAction);
      }
    }], {cancelable: true});
  };

  onActionSelected = (action) => {
    this.toolbarActions[action] && this.toolbarActions[action].onPress.call(this);
  };

  renderToolBar = () =>
    <Toolbar
      title={toolbar.header}
      navIcon={checkWhite}
      overflowIcon={moreWhite}
      actions={this.toolbarActions}
      color="white"
      backgroundColor="#01B47C"
      onIconClicked={this.onSave}
      onActionSelected={this.onActionSelected}
    />;

  onToolAction = (action) => {
    const {note, selection} = this.state;
    const actions = [
      () => {
        Clipboard.getString().then(text => {
          note.content = past(note.content, selection, {start: '', end: text});
          this.setState({note});
        });
      }, null,
      /*() => {
        note.content = past(note.content, selection, {start: '', end: moment().format('YYYY.MM.DD hh:mm ')});
        this.setState({note});
      },*/
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
        note.content = past(note.content, selection, {start: '', end: '# '});
        this.setState({note});
      }, null,
      () => {
        note.content = past(note.content, selection, {start: '', end: '\n- '});
        this.setState({note});
      },
    ];
    actions[action] && actions[action]();
    if (!__DEV__) tracker.trackEvent('Note', 'Use toolbar');
  };

  renderTools = () =>
    <Toolbar
      actions={tools}
      color="black"
      backgroundColor="white"
      onActionSelected={this.onToolAction}
    />;

  onImageLoad = () => {
    this.setState({isLoad: true});
  };

  render() {
    const {note, size, isLoad, editorFocus} = this.state;
    const {title, content, image} = note;
    const {navigate} = this.props.navigation;
    const img = image && size ? {uri: image} : false;
    return (
      <View style={css.container}>
        {this.renderToolBar()}
        <ScrollView style={{flex: 1}}>
          <View style={css.textBox}>
            <TextInput
              value={title}
              style={css.text}
              placeholder={window.title}
              blurOnSubmit={false}
              returnKeyType="next"
              autoFocus
              onChangeText={this.onChange.bind(null, 'title')}
            />
            <AutoExpandingTextInput
              value={content}
              style={css.textMultiLine}
              placeholder={window.content}
              autoCapitalize="sentences"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChangeText={this.onMultiLineInput}
              underlineColorAndroid='transparent'
            />
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
        {editorFocus && <EditBar onPress={this.onToolAction}/>}
        {/*{editorFocus && this.renderTools()}*/}
      </View>
    );
  }
}

export default connect(state => {
  const filter = selectFilter(state);
  return {
    currentFilter: selectCurrentFilter(filter),
    notes: state.notes
  };
})(NoteEdit);

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
  },
  textMultiLine: {
    fontSize: 15,
  },
});