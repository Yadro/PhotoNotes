import * as React from 'react';
import {
  StyleSheet, View, Image, Text, TextInput, ScrollView, ListView, TouchableNativeFeedback, TextStyle, ViewStyle,
} from 'react-native';
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons'
import store from "../redux/Store";
import DialogAndroid from 'react-native-dialogs';
import {ScreenNavigationProp} from "react-navigation";
import {SET_SAVE_FOLDER} from "../constants/ActionTypes";
const {arrowWhite} = icons;

const Item = ({title, subtitle, onPress}) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={css.item}>
      <Text style={css.itemText}>{title}</Text>
      {subtitle && <Text>{subtitle}</Text>}
    </View>
  </TouchableNativeFeedback>
);

function showInputAlert(prefill) {
  return new Promise((resolve, reject) => {
    try {
      const dialog = new DialogAndroid();
      dialog.set({
        title: 'Выбор папки',
        content: 'Введите путь к папке, для сохранения заметок',
        input: {
          prefill,
          callback(text) {
            resolve(text);
          }
        },
        positiveText: 'Ok',
      });
      dialog.show();
    } catch (err) {
      reject(err);
    }
  });
}

interface SettingsP extends ScreenNavigationProp {
}
interface SettingsS {
}
export default class Settings extends React.Component<SettingsP, SettingsS> {

  items = [{
    title: 'Выбрать папку для сохранения',
    subtitle: () => store.getState().other.folder,
    onPress: () => {
      showInputAlert(store.getState().other.folder).then(e => {
        console.log(e);
        store.dispatch({type: SET_SAVE_FOLDER, folder: e});
      });
    },
  }];

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={css.container}>
        <Toolbar title={'Настройки'} onActionSelected={this.props.navigation.goBack}
                 color="white" backgroundColor="#01B47C" navIcon={arrowWhite}/>
        <ScrollView >
          {this.items.map((e, i) => <Item key={i} title={e.title} subtitle={e.subtitle && e.subtitle()} onPress={e.onPress}/>)}
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