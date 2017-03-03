import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  ListView,
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
  ToolbarAndroid,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import store from "./redux/Store";
import {Actions} from "./redux/Actions";
import Note from "./Note";
import {NavigationActions} from "react-navigation";
import {ScreenNavigationProp} from "react-navigation";
import Toolbar from "./Toolbar";
import icons from './Icons'
import AutoExpandingTextInput from "./AutoExpandingTextInput";
const {check, addPhoto, share, deleteIcon} = icons;

const toolbarActions = [
  {title: 'Picker', icon: addPhoto, show: 'always'},
  {title: 'Share', icon: share, show: 'always'},
];

interface NoteEditS {
  note?: Note;
  size?;
  actions?;
  save?;
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
        actions.push({title: 'Delete', icon: deleteIcon, show: 'always'});
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
        this.getImageSize(source.uri);
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
             color="white" backgroundColor="#01B47C" navIcon={check}
             onIconClicked={this.onSave}
             onActionSelected={this.onActionSelected}/>;

  render() {
    const {note, size} = this.state;
    const {title, content, image} = note;
    const {navigate} = this.props.navigation;
    const wrpImage = {uri: image};
    return (
      <View style={css.container}>
        {this.renderToolBar()}
        <ScrollView style={css.container}>
          <View style={css.textBox}>
            <TextInput value={title} style={css.text} placeholder="Title"
                       onChangeText={this.onChange.bind(null, 'title')}/>
            <AutoExpandingTextInput value={content} style={css.textMultiLine}
                                    placeholder="Content"
                                    onChangeText={this.onChange.bind(null, 'content')}/>
          </View>
          <View onTouchEnd={() => navigate('PhotoView', {img: {uri: image}})} style={{flex: 1}}>
            <Image source={wrpImage} resizeMode="cover" style={size}/>
          </View>
        </ScrollView>
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