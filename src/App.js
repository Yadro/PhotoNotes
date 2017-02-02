import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,

} from 'react-native';
/*import {
  ActionSheetProvider,
  connectActionSheet
} from '@exponent/react-native-action-sheet';*/


import PhotoView from 'react-native-photo-view';
import NoteList from "./NoteList";
import NoteComp from "./NoteComp";
import store, {NotesAction} from "./NoteStore";


// @connectActionSheet
export default class App extends Component {

  static navigationOptions = {
    title: 'Welcome',
  };

  constructor() {
    super();
    this.state = store.getState();
  }

  componentWillMount() {
    for (let i = 0; i < 20; i++) {
      NotesAction.add('title');
    }
    store.subscribe((e) => {
      const state = store.getState();
      if (state.update) {
        state.update = false;
        this.setState({store});
      }
    });
  }

  render() {
    const state = store.getState();
    const { navigate } = this.props.navigation;
    return (
      <View style={css.container}>
        <NoteList navigation={this.props.navigation}/>
      </View>

      /*<View style={styles.container}>
       <NoteList/>
       {/!*<PhotoView
       source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
       onLoad={() => console.log("onLoad called")}
       onTap={() => console.log("onTap called")}
       minimumZoomScale={0.5}
       maximumZoomScale={3}
       androidScaleType="center"
       style={styles.photo} />*!/}
       </View>*/
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  photo: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    backgroundColor: "transparent",
    color: "#FFF",
  }
});

class AppContainer extends React.Component {
  render() {
    return (
      <ActionSheetProvider>
        <PhotoNotes/>
      </ActionSheetProvider>
    );
  }
}