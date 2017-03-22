import * as React from 'react';
import {
  StyleSheet, View, Image, Text, TextInput, ScrollView, ListView, TouchableNativeFeedback, TextStyle, ViewStyle,
  NativeModules
} from 'react-native';
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons'
import {SET_SAVE_FOLDER} from "../constants/ActionTypes";
import store from "../redux/Store";
const {arrowWhite} = icons;
const {PopupMenu} = NativeModules;

const Item = ({title, subtitle, onPress}) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={css.item}>
      <Text style={css.itemText}>{title}</Text>
      {subtitle && <Text>{subtitle}</Text>}
    </View>
  </TouchableNativeFeedback>
);

interface SettingsP {
}
interface SettingsS {
}
export default class Settings extends React.Component<SettingsP, SettingsS> {

  items = [{
    title: 'Выбрать папку для сохранения',
    subtitle: '/storage/emulated/0/Android/data/com.photonotes/files',
    onPress: () => {
      PopupMenu.showInput('Выбор папки', 'Введите путь к папке, для сохранения заметок', ['ok'],
        'путь к папке', '/storage/emulated/0/Android/data/com.photonotes/files', (e) => {
        console.log(e);
        store.dispatch({type: SET_SAVE_FOLDER, folder: e.input});
      });
    },
  },{
    title: 'Импорт',
    onPress: () => {},
  }, {
    title: 'Экспорт',
    onPress: () => {},
  }];

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={css.container}>
        <Toolbar title={'Настройки'}
                 color="white" backgroundColor="#01B47C" navIcon={arrowWhite}/>
        <ScrollView >
          {this.items.map((e, i) => <Item key={i} title={e.title} subtitle={e.subtitle} onPress={e.onPress}/>)}
        </ScrollView>
      </View>
    )
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 15,
    color: 'black',
  }
});