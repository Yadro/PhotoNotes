import * as React from 'react';
import {
  StyleSheet, View, Image, Text, TextInput, ScrollView, ListView, TouchableNativeFeedback, TextStyle, ViewStyle,
} from 'react-native';
import Toolbar from "./Toolbar";
import icons from './Icons'
const {arrowWhite} = icons;

const Item = ({title, onPress}) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={css.item}>
      <Text>{title}</Text>
    </View>
  </TouchableNativeFeedback>
);

interface SettingsP {
}
interface SettingsS {
}
export default class Settings extends React.Component<SettingsP, SettingsS> {

  items = [{
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
          {this.items.map((e, i) => <Item key={i} title={e.title} onPress={e.onPress}/>)}
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
});