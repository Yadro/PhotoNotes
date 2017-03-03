import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PhotoView from 'react-native-photo-view';

export default class PhotoViewComp extends Component<any, any> {

  render() {
    const {img} = this.props.navigation.state.params;
    return (
      <View style={css.container}>
        <PhotoView
          source={img}
          onLoad={() => console.log("onLoad called")}
          onTap={() => console.log("onTap called")}
          minimumZoomScale={1}
          maximumZoomScale={4}
          androidScaleType="fitCenter"
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