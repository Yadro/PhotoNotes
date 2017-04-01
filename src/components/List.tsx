import * as React from 'react';
import {View, ListView, TouchableNativeFeedback, Image, Text, StyleSheet, ViewStyle} from 'react-native';
import Note from "../redux/Note";
import PreviewCircle from './PreviewCircle';
const delay = __DEV__ ? 3500 : 1000;

interface ListP {
  selected;
  dataSource;
  pressHandler;
  longPressHandler;
}
interface ListS {
}
export default class List extends React.Component<ListP, ListS> {
  renderRow = (rowData: Note) => {
    // todo refactoring
    const {id, image, title, images} = rowData;
    const {selected, pressHandler, longPressHandler} = this.props;
    const isSelected = selected.includes(id);
    const thumbnail = images && images.thumbnail && images.thumbnail['50'] || image;
    return (
      <TouchableNativeFeedback onPress={pressHandler(id)}
                               onLongPress={longPressHandler.bind(null, id)}
                               delayLongPress={delay}>
        <View style={[css.item, isSelected ? css.selectedItem : null]}>
          <View style={css.imagePrevWrapper}>
            {!!thumbnail ?
              <Image source={{uri: thumbnail}} style={css.imagePrev}/> :
              <PreviewCircle text={title}/>}
          </View>
          <Text style={css.text} numberOfLines={1}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  };

  render() {
    return <ListView style={{backgroundColor: 'white'}} enableEmptySections
                     dataSource={this.props.dataSource} renderRow={this.renderRow}/>
  }
}

const css = StyleSheet.create({
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dedede'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  text: {
    flex: 1,
    fontSize: 17,
    marginRight: 16,
    color: 'black',
  },
  selectedItem: {
    backgroundColor: '#ddd',
  },

  /** Image preview */
  imagePrevWrapper: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  imagePrev: {
    width: 50,
    height: 50,
    margin: 5
  },
});