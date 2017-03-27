import * as React from 'react';
import {Picker, View, Text, StyleSheet} from 'react-native';

export default function DropdownPicker(props) {
  const {title, items, value, onValueChange} = props;
  return <View>
    <Text style={css.label}>{title}</Text>
    <Picker
      style={css.picker}
      mode="dropdown"
      prompt={title}
      selectedValue={value}
      onValueChange={onValueChange}>
      {items.map((e, i) => <Picker.Item key={i} {...e}/>)}
    </Picker>
  </View>
}

const css = StyleSheet.create({
  label: {
    fontSize: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  picker: {
    marginHorizontal: 8,
  }
});