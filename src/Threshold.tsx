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
import {NavigationActions} from "react-navigation";


const toolbarActions = [
  {
    title: 'Add photo', icon: nativeImageSource({
    android: 'ic_check_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'
  },
];

const goBack = (note) => NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({
    routeName: 'NoteEdit',
    params: {note}
  })]
});
interface ThresholdP {
}
interface ThresholdS {
  value;
}
export default class ThresholdComponent extends Component<ThresholdP, ThresholdS> {
  static navigationOptions = {header: {visible: false}};
  navigation;

  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    const src = props.navigation.state.params && props.navigation.state.params.src;
    this.state = {
      value: 85,
      src
    };
  }

  onActionSelected = (action) => {
    if (action == 0) {
      const {src: filePath, value} = this.state;
      readThresholdSave(filePath, filePath + 'bw.png', value)
        .then(e => {
          const {note} = this.props.navigation.state.params;
          note.image = e.uri;
          this.navigation.dispatch(goBack(note));
        });
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
      />
      <PhotoView src={this.state.src} value={value} style={{flex:1}} />
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