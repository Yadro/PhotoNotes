import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from 'react-native';
import NoteList from "./NoteList";
import NoteComp from "./NoteComp";
import store, {NotesAction} from "./NoteStore";
import NoteView from "./NoteView";


export default class App extends Component {

  static navigationOptions = {
    title: 'Welcome',
    header: (e) => {
      return {
        right: <Button title={'New'} onPress={() => e.navigate('NoteView', {id: 0})}/>
      }
    },
  };

  constructor() {
    super();
    this.state = store.getState();
    console.log('App start');
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
    const {navigate} = this.props.navigation;
    return (
      <View style={css.container}>
        <NoteList navigation={this.props.navigation}/>
      </View>
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