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
import NavBar, {NavButton, NavButtonText, NavTitle} from 'react-native-nav'
import PhotoView from 'react-native-photo-view';
import NoteList from "./src/NoteList";
import NoteComp from "./src/NoteComp";
import store, {NotesAction} from "./src/NoteStore";

const routes = [
  {index: 'list', comp: <View><NoteList/></View>},
  {index: 'item', comp: <NoteComp/>}
];

export default class PhotoNotes extends Component {

  constructor() {
    super();
    this.state = store.getState();
  }

  navigatorRender = (_route, navigator) => {
    const {view} = store.getState();
    const route = routes.find(r => r.index == view);
    return route ? route.comp : routes[0].comp;
  };

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
    return (
      <View style={css.container}>
        <NavBar>
          <NavTitle>{"Photo Notes"}</NavTitle>
        </NavBar>
        <Navigator
          initialRoute={routes[0]}
          initialRouteStack={routes}
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
