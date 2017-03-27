import * as React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableNativeFeedback, TextStyle, ViewStyle, ToastAndroid, Share,
} from 'react-native';
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons'
import store from "../redux/Store";
import DialogAndroid from 'react-native-dialogs';
import {ScreenNavigationProp} from "react-navigation";
import {SET_SAVE_FOLDER} from "../constants/ActionTypes";
import fs from 'react-native-fs';
import {ActionOther} from "../redux/Actions";
import {downloadUrl, emailSendFeedback, emailSendThx, version} from "../constants/Config";
import {sendEmail} from "../util/util";
const {arrowWhite} = icons;

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
    subtitle:() => store.getState().other.folder,
    onPress() {
      let folder;
      showInputAlert(store.getState().other.folder).then(_folder => {
        return fs.exists(folder = _folder);
      }).then(exist => {
        if (exist) {
          console.log(folder);
          ActionOther.setSaveFolder(folder);
          ToastAndroid.show('Ясно, а теперь перезапустите приложение', ToastAndroid.LONG);
        } else {
          ToastAndroid.show('Папка не найдена', ToastAndroid.LONG);
        }
      })
    },
  }, {
    title: 'Отправить отзыв',
    onPress() {
      sendEmail(emailSendFeedback);
    },
  }, {
    title: 'Сказать спасибо :)',
    subtitle: 'Но лучший способ меня поддержать - рассказать об этом приложении друзям, кнопка ниже',
    onPress() {
      sendEmail(emailSendThx);
    },
  }, {
    title: 'Поделится с друзьями',
    onPress() {
      Share.share({
        title: 'Edditr',
        message: 'Скачать: ' + downloadUrl
      }, {});
    },
  }, {
    title: 'Версия приложения',
    subtitle: version,
    onPress: () => {
      this.count++;
      if (this.count == 10) {
        ToastAndroid.show('Здесь не на что смотреть.\nПроходите..', ToastAndroid.BOTTOM);
      }
    }
  }];

  count = 0;

  getString(data) {
    if (typeof data == "function") {
      return data();
    }
    return data;
  }

  render() {
    return (
      <View style={css.container}>
        <Toolbar title={'Настройки'} onActionSelected={this.props.navigation.goBack}
                 color="white" backgroundColor="#01B47C" navIcon={arrowWhite}/>
        <ScrollView >
          {this.items.map((e, i) => (
            <Item key={i} title={e.title} subtitle={e.subtitle && this.getString(e.subtitle)} onPress={e.onPress}/>
          ))}
        </ScrollView>
      </View>
    )
  }
}

function Item({title, subtitle, onPress}) {
  return <TouchableNativeFeedback onPress={onPress}>
    <View style={css.item}>
      <Text style={css.itemText} numberOfLines={1}>{title}</Text>
      {subtitle && <Text>{subtitle}</Text>}
    </View>
  </TouchableNativeFeedback>
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    padding: 16,
    minHeight: 56,
  },
  itemText: {
    fontSize: 15,
    color: 'black',
  }
});