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
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import store from "./redux/Store";
import {Actions} from "./redux/Actions";
import Note from "./Note";

export default class NoteEdit extends Component<any, any> {

  static navigationOptions = {
    title: 'NoteEdit'
  };

  constructor(props) {
    super(props);
    const {notes} = store.getState().notes;
    const params = props.navigation.state.params;
    if (params && params.id != null) {
      const note: Note = notes.find(e => e.id == params.id);
      this.state = {
        note,
        id: params.id,
        size: null,
        image: {uri: note.image}
      };
    } else {
      this.state = {
        note: new Note(),
        id: null,
        size: null,
        image: null,
      };
    }
    this.onChange = this.onChange.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.getImageSize = this.getImageSize.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const {image} = this.state;
    if (image.uri) {
      this.getImageSize(image.uri);
    }
  }

  getImageSize(image: string) {
    Image.getSize(image, (width, height) => {
      const size = {
        width: store.getState().other.size.width,
        height,
      };
      this.setState({size});
    });
  }

  showPicker() {
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
    const {navigate} = this.props.navigation;
    const {note} = this.state;
    Actions.add(note);
    navigate('Main');
  }

  onDelete() {
    const {navigate} = this.props.navigation;
    Actions.remove(this.state.id);
    navigate('Main');
  }

  render() {
    const {note, id, size, image} = this.state;
    const {title, content} = note;
    const {navigate, goBack} = this.props.navigation;
    return (
      <ScrollView style={css.container}>
        <Image source={image} style={size}/>
        <Text>note id = {id}</Text>
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
        <View style={css.buttons}>
          <View style={css.button}><Button title="Cancel" onPress={() => goBack()} color="grey"/></View>
          <View style={css.button}><Button title="Delete" onPress={this.onDelete} color="red"/></View>
          <View style={css.button}><Button title="Picker" onPress={this.showPicker}/></View>
          <View style={css.button}><Button title="Save" onPress={this.onSave}/></View>
        </View>
      </ScrollView>
    );
  }
};

const css = StyleSheet.create({
  container: {
    margin: 10,
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