import * as React from 'react';
import {Component} from 'react';
import {View, StatusBar, Text} from 'react-native';
import {Provider} from 'react-redux'
import store from "./redux/Store";
import {tracker} from "./Analytics";
import {AppDrawer} from "./router/AppRouteConfigs";
import {ActionNote} from "./constants/ActionNote";
import {ActionFilter} from "./constants/ActionFilter";

store.dispatch(ActionNote.doImportNotes());
store.dispatch(ActionFilter.doImportFilter());

export default class AppWithStore extends Component<any, any> {
  constructor(props) {
    super(props);
    console.log('App start');
    if (!__DEV__) tracker.trackScreenView('Home');
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <StatusBar
            backgroundColor="#019967"
            barStyle="light-content"
          />
          <AppDrawer/>
        </View>
      </Provider>
    )
  }
}