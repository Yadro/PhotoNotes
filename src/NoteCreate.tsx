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
  Platform
} from 'react-native';
import {Actions} from "./redux/Actions";
import ImagePicker, {Response} from "react-native-image-picker";
import Note from "./Note";
import store from "./redux/Store";

export default class NoteCreate extends Component<any, any> {

  static navigationOptions = {
    title: 'Create new note',
  };

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

  render() {
    const {note, size, image} = this.state;
    const {title, content} = note;
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={css.container}>
        {image.uri ? <Image source={image} style={size}/> : null}
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
          <Button title="Picker" onPress={this.showPicker}/>
          <Button style={css.cancelBtn} title={'Cancel'} onPress={() => navigate('Main')}/>
          <Button style={css.saveBtn} title={'Save'} onPress={() => {
            note.image = image.uri;
            note.title = note.title || '' + Date.now();
            Actions.add(note);
            navigate('Main');
          }}/>
        </View>
      </ScrollView>
    );
  }
}


const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});