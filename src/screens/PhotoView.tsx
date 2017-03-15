import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Image from 'react-native-image-zoom';

export default class PhotoViewComp extends Component<any, any> {

  render() {
    const {img} = this.props.navigation.state.params;
    return (
      <View style={css.container}>
        <Image
          source={img}
          onLoad={() => console.log("onLoad called")}
          onLoadStart={() => console.log("onLoad start")}
          onLoadEnd={() => console.log("onLoadEnd end")}
          onTap={() => console.log("onTap called")}
          style={{flex: 1}}/>
      </View>
    )
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
  }
});