import * as React from 'react';
import {Image, Text, TouchableNativeFeedback, StyleSheet, View, ViewStyle} from 'react-native';
import PreviewCircle from './PreviewCircle';

export const ListItem = ({id, image, title, images, onPress}) => {
  const thumbnail = images && images.thumbnail && images.thumbnail['50'] || image;
  return (
    <TouchableNativeFeedback onPress={onPress(id)}>
      <View style={css.item}>
        <View style={css.imagePrevWrapper}>
          {!!thumbnail ?
            <Image source={{uri: thumbnail}} style={css.imagePrev}/> :
            <PreviewCircle text={title}/>}
        </View>
        <Text style={css.text}>{title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

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
  } as ViewStyle,
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