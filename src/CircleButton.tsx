import * as React from 'react';
import {Component} from 'react';
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
export const CircleButton = ({title, color, size, backgroundColor, highlight, onPress}) => {
  return (
    <View style={{borderRadius: size / 2, width: size, height: size}}>
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(highlight, true)} onPress={onPress}>
        <View style={{backgroundColor: backgroundColor, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color, fontSize: size / 4}}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  )
};


