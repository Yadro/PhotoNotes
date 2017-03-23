import * as React from 'react';
import {View, Image, Text, TouchableOpacity, TouchableNativeFeedback, StyleSheet} from 'react-native';
import {paths} from './Icons';
const {checkboxBlankBlack, checkboxBlack} = paths;

export const CheckboxItem = ({title, onPress, value}) => {
  return <TouchableNativeFeedback onPress={onPress} style={css.container}>
    <View style={css.wrapper}>
      <Image source={{uri: value ? checkboxBlack : checkboxBlankBlack}}
             style={css.image} tintColor="#01b47c"/>
      <Text style={css.text}>{title}</Text>
    </View>
  </TouchableNativeFeedback>
};

const css = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  text: {
    color: 'black',
  },
});