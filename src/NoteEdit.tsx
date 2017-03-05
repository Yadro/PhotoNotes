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
import {getResizedImage} from "./util";
const {
  checkWhite, addPhotoWhite, shareWhite, deleteIconWhite,
  boldWhite, italicWhite, underWhite, listBulletWhite, titleWhite, pastWhite,
  undoWhite, redoWhite
} = icons;

const toolbarActions = [
  {title: 'Picker', icon: addPhotoWhite, show: 'always'},
  {title: 'Share', icon: shareWhite, show: 'always'},
];

const tools = [
  /*{title: 'Undo', icon: undoWhite, show: 'always'},
  {title: 'Redo', icon: redoWhite, show: 'always'},*/
  {title: 'Past', icon: pastWhite, show: 'always'},
  {title: 'Bold', icon: boldWhite, show: 'always'},
  {title: 'Italic', icon: italicWhite, show: 'always'},
  {title: 'Underline', icon: underWhite, show: 'always'},
  {title: 'List', icon: listBulletWhite, show: 'always'},
  {title: 'Header', icon: titleWhite, show: 'always'},
];

interface NoteEditS {
  note?: Note;
  size?;
  actions?;
  save?;
  image?;
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
        this.state = {
          note: Object.assign({}, params.note),
          size: null,
          actions,
        };
      } else if (params.id) {
        const note = Object.assign({},
          notes.find(e => e.id == params.id)
        );
        actions.push({title: 'Delete', icon: deleteIconWhite, show: 'always'});
        this.state = {
          note,
          size: null,
          actions,
          save: true,
        };
      }
    }
    else {
      this.state = {
        note: new Note(),
        size: null,
        actions,
      };
    }
  }

  componentDidMount() {
    const {image} = this.state.note;
    if (image) {
      this.getImageSize(image);
    }
  }

  getImageSize = (image: string) => {
    const screenWidth = store.getState().other.size.width;
    Image.getSize(image, (width, height) => {
      const delta = Math.abs((screenWidth - width) / width * 100);
      const size = {
        width: screenWidth,
        height: height - height / 100 * delta,
      };
      this.setState({size});
    }, () => {
    });
  };

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

  onSave = () => {
    const {note, save} = this.state;
    Actions[save ? 'update' : 'add'](note);
    // this.props.navigation.goBack();
    this.props.navigation.dispatch(NoteEdit.resetAction);
  };

  onDelete = () => {
    Actions.remove(this.state.note.id);
    this.props.navigation.dispatch(NoteEdit.resetAction);
  };

  onActionSelected = (action) => {
    const actions = [
      this.showPicker,
      this.showPicker,
      this.onDelete,
    ];
    actions[action] && actions[action]();
  };

  renderToolBar = () =>
    <Toolbar title="Edit" actions={this.state.actions}
             color="white" backgroundColor="#01B47C" navIcon={checkWhite}
             onIconClicked={this.onSave}
             onActionSelected={this.onActionSelected}/>;

  onToolAction = (action) => {
    console.log(action);
    const {note} = this.state;
    const actions = [
      /*null,
      null,*/
      () => {
        Clipboard.getString().then(text => {
          note.content += text;
          this.setState({note});
        });
      },
      () => {
        note.content += '*';
        this.setState({note});
      }, () => {
        note.content += '_';
        this.setState({note});
      }, () => {
        note.content += '~~';
        this.setState({note});
      }, () => {
        note.content += '\n- ';
        this.setState({note});
      }, () => {
        note.content += '\n# ';
        this.setState({note});
      }
    ];
    actions[action] && actions[action]();
  };

  renderTools = () =>
    <Toolbar actions={tools} color="white" backgroundColor="#01B47C"
             onActionSelected={this.onToolAction}/>;

  render() {
    const {note, size} = this.state;
    const {title, content, image} = note;
    const {navigate} = this.props.navigation;
    const wrpImage = image && image !== '' ? {uri: image} : false;
    return (
      <View style={css.container}>
        {this.renderToolBar()}
        <ScrollView style={css.container}>
          <View style={css.textBox}>
            <TextInput value={title} style={css.text} placeholder="Title"
                       blurOnSubmit={false} returnKeyType="next"
                       onChangeText={this.onChange.bind(null, 'title')}/>
            <AutoExpandingTextInput value={content} style={css.textMultiLine}
                                    placeholder="Content" autoCapitalize="sentences"
                                    onChangeText={this.onChange.bind(null, 'content')}/>
          </View>
          {wrpImage &&
            <View onTouchEnd={() => navigate('PhotoView', {img: wrpImage})} style={{flex: 1}}>
              <Image source={wrpImage} resizeMode="cover" style={size}/>
            </View>
          }
        </ScrollView>
        {this.renderTools()}
      </View>
    );
  }
};

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
    textAlignVertical: 'top',
  },
});