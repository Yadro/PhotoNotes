import * as React from 'react';
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
export function CircleButton({title, color, size, backgroundColor, highlight, onPress}) {
  size = +size;
  return (
    <View style={{borderRadius: size / 2, width: size, height: size}}>
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(highlight, true)} onPress={onPress}>
        <View style={{backgroundColor: backgroundColor, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color, fontSize: size / 4}}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

export function CircleButtonImage(props) {
  let {content, color, size, fontSize, backgroundColor, highlight, onPress} = props;
  size = +size;
  fontSize = +fontSize;
  return (
    <View style={{borderRadius: size / 2, width: size, height: size}}>
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(highlight, true)} onPress={onPress}>
        <View style={{backgroundColor: backgroundColor, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {typeof content == "string"
            ? <Text style={{color, fontSize}}>{content}</Text>
            : content
          }
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}


