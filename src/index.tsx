import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';
import store from "./redux/Store";
import App from './App';
import NoteEdit from './NoteEdit';
import NoteView from "./NoteView";
import NoteCreate from "./NoteCreate";

const BasicApp = StackNavigator({
  Main: {screen: App},
  NoteEdit: {screen: NoteEdit},
  NoteView: {screen: NoteView},
  NoteCreate: {screen: NoteCreate},
});

export default class AppWithStore extends Component<any, any> {
  disp;
  constructor() {
    super();
    this.state = store.getState().other;
    console.log('App start');
  }
  componentWillMount() {
    this.disp = store.subscribe((e) => {
      const {other, notes} = store.getState();
      if (other.update) {
        other.update = false;
        this.setState({other});
      }
    });
  }
  componentWillUnmount() {
    this.disp();
  }

  render() {
    return <BasicApp/>;
  }
}