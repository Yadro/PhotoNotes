import * as React from 'react';
import {Component} from 'react';
import {
  View,
  StatusBar,
  AsyncStorage,
  Text,
} from 'react-native';
import {StackNavigator, DrawerNavigator, DrawerView} from 'react-navigation';
import {Provider, connect} from 'react-redux'
import store from "./redux/Store";
import NoteEdit from './screens/NoteEdit';
import NoteView from "./screens/NoteView";
import NoteList from "./screens/NoteList";
import NoteTags from "./screens/NoteTags";
import Threshold from "./screens/Threshold";
import PhotoViewComp from "./screens/PhotoView";
import {tracker} from "./Analytics";
import Search from "./screens/Search";
import Password from "./screens/Password";
import Settings from "./screens/Settings";
import Trash from './screens/Trash';
import {Actions} from "./redux/Actions";
import {importNotes} from "./redux/StoreImport";
import NavigationDrawer from "./screens/NavigationDrawer";
import EditFilter from './screens/EditFilter';

const App = StackNavigator({
  Main: {screen: NoteList},
  EditFilter: {screen: EditFilter},
  Trash: {screen: Trash},
  Search: {screen: Search},
  NoteEdit: {screen: NoteEdit},
  NoteView: {screen: NoteView},
  NoteTags: {screen: NoteTags},
  PhotoView: {screen: PhotoViewComp},
  Threshold: {screen: Threshold},
  Settings: {screen: Settings},
  Password: {screen: Password},
}, {
  headerMode: 'none'
});

const AppDrawer = DrawerNavigator({
  App: {screen: App},
}, {
  contentComponent(props) {
    return <NavigationDrawer {...props}/>;
  },
  contentOptions: {
    activeTintColor: '#01B47C',
  },
});

importNotes().then(data => {
  Actions.importNotes(data);
}).catch(e => {
  console.log(e)
});

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