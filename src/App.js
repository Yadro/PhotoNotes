import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from 'react-native';
import {
  FloatingActionButton,
  NestedScrollView,
  CoordinatorLayout,
  BottomSheetBehavior,
} from 'react-native-bottom-sheet-behavior'
import NoteList from "./NoteList";
import store, {NotesAction} from "./NoteStore";
import NoteView from "./NoteView";
import Note from "./Note";


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
      NotesAction.add(new Note('Note'));
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
        <FloatingActionButton ref="fab" style={css.button} onPress={() => navigate('NoteEdit')}/>
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
  },
  button: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 10,
    bottom: 10,
  }
});