import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

export default class PhotoView extends Component<any, any> {
  render() {
    return (
      <View style={css.container}>
        <Image style={css.image} source={this.props.navigation.state.params.img} resizeMode="contain"/>
      </View>
    )
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  image: {
    flex: 1,
  }
});