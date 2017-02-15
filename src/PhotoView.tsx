import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import PhotoView from 'react-native-photo-view';

export default class MyPhotoView extends Component<any, any> {
  static navigationOptions  = {
    header: {
      visible: false,
    },
  };
  render() {
    const {img} = this.props.navigation.state.params;
    return (
      <View style={css.container}>
        {/*<Image style={css.image} source={this.props.navigation.state.params.img} resizeMode="contain"/>*/}
        <PhotoView
          source={img}
          onLoad={() => console.log("onLoad called")}
          onTap={() => console.log("onTap called")}
          minimumZoomScale={0.9}
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
    backgroundColor: '#4e4e4e',
  },
  image: {
    flex: 1,
  }
});