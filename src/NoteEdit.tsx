import React, {Component} from 'react';
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
import PhotoView from "./PhotoView";
const nativeImageSource = require('nativeImageSource');

const toolbarActions = [
  {title: 'Picker', icon: nativeImageSource({
    android: 'ic_add_a_photo_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'},
  {title: 'Save', icon: nativeImageSource({
    android: 'ic_check_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'},
  {title: 'Delete'},
];

export default class NoteEdit extends Component<any, any> {

  static navigationOptions = {
    header: {visible: false}
  };
  static resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({routeName: 'Main'})
    ]
  });

  constructor(props) {
    super(props);
    const notes = store.getState().notes;
    const params = props.navigation.state.params;
    const note: Note = notes.find(e => e.id == params.id);
    this.state = {
      note,
      id: params.id,
      size: null,
    };
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
        let source = {uri: 'data:image/jpeg;base64,' + response.data};
        if (Platform.OS === 'android') {
          source = {uri: response.uri};
        } else {
          source = {uri: response.uri.replace('file://', '')};
        }
        this.getImageSize(source.uri);
        this.onChange('image', source.uri);
      }
    });
  };

  onChange = (field, data) => {
    const {note} = this.state;
    note[field] = data;
    this.setState({note});
  };

  onSave = () => {
    Actions.update(this.state.note);
    this.props.navigation.dispatch(NoteEdit.resetAction);
  };

  onDelete = () => {
    Actions.remove(this.state.id);
    this.props.navigation.dispatch(NoteEdit.resetAction);
  };

  onActionSelected = (action) => {
    const {goBack} = this.props.navigation;
    if (action == null) {
      goBack();
    } else if (action == 0) {
      this.showPicker();
    } else if (action == 1) {
      this.onSave();
    } else if (action == 2) {
      this.onDelete();
    }
  };

  renderToolBar = () => {
    return (
      <ToolbarAndroid
        elevation={5}
        actions={toolbarActions}
        style={css.toolbar}
        title="Edit"
        onIconClicked={this.onActionSelected}
        onActionSelected={this.onActionSelected}
        navIcon={nativeImageSource({
            android: 'ic_arrow_back_black_24dp',
            width: 24,
            height: 24
          })}
      />
    )
  };

  render() {
    const {note, id, size} = this.state;
    const {title, content, image} = note;
    const {navigate} = this.props.navigation;
    const wrpImage = {uri: image};
    return (
      <View style={css.container}>
        {this.renderToolBar()}
        <ScrollView style={css.container}>
          <View onTouchEnd={() => navigate('MyPhotoView', {img: wrpImage})} style={{flex: 1}}>
            <Image source={wrpImage} resizeMode="contain" style={size}/>
          </View>
          <Text>note id = {id}</Text>
          <TextInput value={title}
                     style={css.text}
                     type="text"
                     placeholder="Title"
                     onChangeText={this.onChange.bind(null, 'title')}/>
          <TextInput value={content}
                     style={css.text}
                     type="text"
                     multiline
                     placeholder="Content"
                     onChangeText={this.onChange.bind(null, 'content')}/>
        </ScrollView>
      </View>
    );
  }
};

const css = StyleSheet.create({
  toolbar: {
    backgroundColor: '#fff',
    height: 56,
  },
  container: {
    flex: 1,
  },
  text: {
    fontSize: 15,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    marginBottom: 20
  },
  button: {

  },
  cancelBtn: {
    flex: 1,
    margin: 5,
  },
  saveBtn: {
    flex: 1,
    margin: 5,
  }
});