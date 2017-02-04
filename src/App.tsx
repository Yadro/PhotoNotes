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
} from 'react-native-bottom-sheet-behavior';
import NoteList from "./NoteList";
import store from "./redux/Store";
import {Actions, ActionOther} from "./redux/Actions";
import NoteView from "./NoteView";

export default class App extends Component<any, any> {

  disp;

  static navigationOptions = {
    title: 'Welcome',
    header: (e) => {
      return {
        right: <Button title={'New'} onPress={() => e.navigate('NoteView', {id: 0})}/>
      }
    },
  };

  onLayout(event) {
    const {size} = store.getState().other;
    if (!size) {
      const {x, y, width, height} = event.nativeEvent.layout;
      ActionOther.setViewSize({width: width + x, height: height + y});
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={css.container} onLayout={this.onLayout}>
        <NoteList navigation={this.props.navigation}/>
        <FloatingActionButton ref="fab" style={css.button} onPress={() => navigate('NoteCreate')}/>
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