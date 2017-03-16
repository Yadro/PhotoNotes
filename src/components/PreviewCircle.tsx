import * as React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';

export default ({text}) => {
  const symbols = text.split(/\s+/).map(e => e.charAt(0).toUpperCase()).join('').substr(0, 2);
  return <View style={css.previewContainer}>
    <View style={css.previewContainerWrapper}>
      <Text style={css.preview}>{symbols}</Text>
    </View>
  </View>;
}

const css = StyleSheet.create({
  previewContainer: {
    borderRadius: 21,
    width: 42,
    height: 42,
    backgroundColor: '#01B47C'
  },
  previewContainerWrapper: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  preview: {
    fontSize: 20,
    color: '#fff',
  },

  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    right: 20,
    bottom: 20,
  }
});