import * as React from 'react';
import {StackNavigator, DrawerNavigator} from 'react-navigation';

import NoteEdit from '../screens/NoteEdit';
import NoteView from "../screens/NoteView";
import NoteList from "../screens/NoteList";
import NoteTags from "../screens/NoteTags";
import Threshold from "../screens/Threshold";
import PhotoViewComp from "../screens/PhotoView";
import Search from "../screens/Search";
import Password from "../screens/Password";
import Settings from "../screens/Settings";
import EditFilter from '../screens/EditFilter';
import NavigationDrawer from "../screens/NavigationDrawer";

export const AppRouteConfig = {
  Main: {screen: NoteList},
  EditFilter: {screen: EditFilter},
  Search: {screen: Search},
  NoteEdit: {screen: NoteEdit},
  NoteView: {screen: NoteView},
  NoteTags: {screen: NoteTags},
  PhotoView: {screen: PhotoViewComp},
  Threshold: {screen: Threshold},
  Settings: {screen: Settings},
  Password: {screen: Password},
};

export const App = StackNavigator(
  AppRouteConfig,
  {headerMode: 'none'}
);

export const AppDrawer = DrawerNavigator({
  App: {screen: App},
}, {
  contentComponent(props) {
    return <NavigationDrawer {...props}/>;
  },
  contentOptions: {
    activeTintColor: '#01B47C',
  },
});