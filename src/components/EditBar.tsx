import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ViewStyle,
} from "react-native";
import {CircleButtonImage} from "./CircleButton";
import {Icon, paths} from "./Icons";
import {getElementType} from "../util/reactUtil";


const css = StyleSheet.create({
  wrapper: {
    height: 50,
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    marginTop: -5,
    justifyContent: 'space-around',
  } as ViewStyle,
});

const styleDelimiter = {
  width: 1,
  backgroundColor: '#ededed'
};
export function Delimiter(): JSX.Element {
  return <View style={styleDelimiter}/>;
}

const buttons: (JSX.Element | Function)[] = [
  <Icon uri={paths.pastWhite} tint="grey"/>,
  (key) => <Delimiter key={key}/>,
  <Icon uri={paths.boldWhite} tint="grey"/>,
  <Icon uri={paths.italicWhite} tint="grey"/>,
  <Icon uri={paths.underWhite} tint="grey"/>,
  (key) => <Delimiter key={key}/>,
  <Icon uri={paths.listBulletWhite} tint="grey"/>,
];

function create(el: JSX.Element | Function, key: string | number, onPress): JSX.Element {
  if (typeof el === "function") {
    return el(key);
  } else {
    return <CircleButtonImage key={key} onPress={onPress} content={el} size="60" fontSize="15"/>
  }
}

export function EditBar({onPress}) {
  return (
    <View style={css.wrapper} elevation={3}>
      <View style={css.container}>
        {buttons.map((content, key) => create(content, key, onPress.bind(null, key)))}
      </View>
    </View>
  )
}

