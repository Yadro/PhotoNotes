/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Navigator,
} from 'react-native';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav'
import PhotoView from 'react-native-photo-view';
import NoteList from "./src/NoteList";
import NoteComp from "./src/NoteComp";
import NoteStorage from "./src/NoteStorage";


export default class PhotoNotes extends Component {

  routes;

  constructor() {
    super();
    this.state = {
      selectedId: 0,
      noteStorage: new NoteStorage(this.forceUpdate.bind(this)),
    };
    this.routes = [
      {index: 0, comp:
        <View>
          <NoteList choose={this.selectNote} notes={this.state.noteStorage}/>
        </View>},
      {index: 1, comp:
        <NoteComp note={this.state.selectedId} notes={this.state.noteStorage}/>},
    ];
  }

  componentWillMount() {
    for (let i = 0; i < 20; i++) {
      this.state.noteStorage.add('title');
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.setState({selectedId: nextState.noteStorage.currentId});
    return true;
  }

  selectNote = (id) => {
    this.setState({selectedId: id});
  };

  navigatorRender = (route, navigator) => {
    console.log(route);
    return route.comp;
  };

  render() {
    return (
      <View style={css.container}>
        <NavBar>
          <NavTitle>{"Photo Notes"}</NavTitle>
        </NavBar>
        <Navigator
          initialRoute={this.routes[0]}
          initialRouteStack={this.routes}
          renderScene={this.navigatorRender}/>
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


AppRegistry.registerComponent('PhotoNotes', () => PhotoNotes);
