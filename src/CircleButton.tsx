import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback,
  StyleSheet,
} from "react-native";


const css = StyleSheet.create({
  textView: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  }
});
export const CircleButton = ({title, size}) => {
  title = '+';
  size = 48;
  return (
    <View style={{borderRadius: size / 2, width: size, height: size}}>
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#AAF', true)}>
        <View style={{backgroundColor: '#F66', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  )
};


