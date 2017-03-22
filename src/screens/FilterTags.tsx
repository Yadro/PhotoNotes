import * as React from 'react';
import {View, Text, Image, TouchableNativeFeedback, StyleSheet} from 'react-native';
import icons from '../components/Icons';
const {editWhite} = icons;

interface TagsLayerP {
}
interface TagsLayerS {
}


export default class FilterTags extends React.Component<TagsLayerP, TagsLayerS> {
  buttons = [{
    title: 'Добавить фильтр',
    onPress: () => {
    },
    onLongPress: () => {
    },
  }, {
    title: 'Добавить фильтр',
    onPress: () => {
    },
    onLongPress: () => {
    },
  }];

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const items = this.buttons.map((e, i) => <Item key={i} {...e}/>);
    return <View style={{flex: 1}}>
      {items}
    </View>
  }
}

const Item = ({title, onPress, onLongPress}) => {
  return <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress} style={css.container}>
    <View style={css.item}>
      {/*<Image source={{uri: editWhite}}/>*/}
      <Text>{title}</Text>
    </View>
  </TouchableNativeFeedback>
};

const css = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  }
});