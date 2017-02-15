import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  Slider,
  ToolbarAndroid,
  StyleSheet
} from 'react-native';
const nativeImageSource = require('nativeImageSource');
import {PhotoView, readThresholdSave} from '../android/PhotoModule/index.js';


const toolbarActions = [
  {
    title: 'Add photo', icon: nativeImageSource({
    android: 'ic_add_a_photo_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'
  },
];
interface ThresholdP {
}
interface ThresholdS {
  value;
}
export default class ThresholdComponent extends Component<ThresholdP, ThresholdS> {

  constructor(props) {
    super(props);
    this.state = {value: 85};
  }

  onActionSelected = () => {
    const {goBack} = this.props.navigation;
    if (action == null) {
      goBack();
    }
  };

  render() {
    const {value} = this.state;
    return <View style={{flex: 1}}>
      <ToolbarAndroid
        elevation={5}
        actions={toolbarActions}
        style={css.toolbar}
        title="Threshold"
        onIconClicked={this.onActionSelected}
        onActionSelected={this.onActionSelected}
        navIcon={nativeImageSource({
            android: 'ic_arrow_back_black_24dp',
            width: 24,
            height: 24
          })}
      />
      <PhotoView src="/storage/emulated/0/Download/text.jpg" value={value} style={{flex:1}} />
      <Slider onSlidingComplete={value => this.setState({value})} value={this.state.value} minimumValue={1} maximumValue={100}/>
    </View>
  }
}

const css = StyleSheet.create({
  toolbar: {
    backgroundColor: '#fff',
    height: 56,
  },
});