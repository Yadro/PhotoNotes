import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextStyle,
} from 'react-native';

interface AboutP {
}
interface AboutS {
}
export default class About extends React.Component<AboutP, AboutS> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <View>
      <Text style={css.header}>About</Text>
      <Text>With love from Russia</Text>
    </View>
  }
}

const css = StyleSheet.create({

  header: {
    fontWeight: 'bold',
    fontSize: 20,
  } as TextStyle,
});