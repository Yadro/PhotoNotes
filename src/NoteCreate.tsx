import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
  ToolbarAndroid,
  Platform
} from 'react-native';
import {Actions} from "./redux/Actions";
import ImagePicker from "react-native-image-picker";
import Note from "./Note";
import store from "./redux/Store";
import {NavigationActions} from "react-navigation";
import {ScreenNavigationProp} from "react-navigation";
const nativeImageSource = require('nativeImageSource');

const toolbarActions = [
  {title: 'Add photo', icon: nativeImageSource({
    android: 'ic_add_a_photo_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'},
  {title: 'Back', icon: nativeImageSource({
    android: 'ic_check_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'},
];

export default class NoteCreate extends Component<ScreenNavigationProp, any> {

  static navigationOptions = {
    header: {
      visible: false,
    }
  };
  static resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({routeName: 'Main'})
    ]
  });

  constructor(props) {
    super(props);
    this.state = {
      note: new Note(),
      size: null,
      image: {uri: null}
    };
    this.onChange = this.onChange.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.getImageSize = this.getImageSize.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  getImageSize(image: string) {
    const screenWidth = store.getState().other.size.width;
    Image.getSize(image, (width, height) => {
      const delta = Math.abs((screenWidth - width) / width * 100);
      const size = {
        width: screenWidth,
        height: height - height / 100 * delta,
      };
      this.setState({size});
    });
  }

  showPicker() {
    ImagePicker.showImagePicker({storageOptions: true}, (response: Response) => {
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
        this.setState({
          image: source
        });
      }
    });
  }

  onChange(field, text) {
    const {note} = this.state;
    note[field] = text;
    this.setState({note});
  }

  onSave() {
    const {note, image} = this.state;
    note.image = image.uri;
    note.title = note.title || '' + Date.now();
    Actions.add(note);
    this.props.navigation.dispatch(NoteCreate.resetAction);
  }

  onActionSelected = (action) => {
    const {goBack} = this.props.navigation;
    if (action == null) {
      goBack();
    } else if (action == 0) {
      this.showPicker();
    }else if (action == 1) {
      this.onSave();
    }
  };

  renderToolBar = () => {
    return (
      <ToolbarAndroid
        elevation={5}
        actions={toolbarActions}
        style={css.toolbar}
        title="Create"
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
    const {note, size, image} = this.state;
    const {title, content} = note;
    const {goBack} = this.props.navigation;
    return (
      <ScrollView style={css.container}>
        {this.renderToolBar()}
        {image.uri
          ? <Image source={image} resizeMode="contain" style={size}/> : null}
        <TextInput value={title}
                   style={css.text}
                   type="text"
                   placeholder="Title"
                   onChangeText={this.onChange.bind(null, 'title')}/>
        <TextInput value={content}
                   style={css.text}
                   type="text"
                   placeholder="Content"
                   onChangeText={this.onChange.bind(null, 'content')}/>
        {/*<View style={css.buttons}>
          <View style={css.button}><Button title="Picker" onPress={this.showPicker}/></View>
          <View style={css.button}><Button title="Save" onPress={this.onSave}/></View>
        </View>*/}
      </ScrollView>
    );
  }
}


const css = StyleSheet.create({
  toolbar: {
    backgroundColor: '#fff',
    height: 56,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
  text: {

  }
});