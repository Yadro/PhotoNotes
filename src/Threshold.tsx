import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  Slider,
  StyleSheet
} from 'react-native';
import {PhotoView, readThresholdSave} from '../android/PhotoModule/index.js';
import {NavigationActions} from "react-navigation";
import {ScreenNavigationProp} from "react-navigation";
import CheckBox from 'react-native-check-box';
import Toolbar from "./Toolbar";
import icons from './Icons';
const {checkWhite, cropBlack, redoBlack, undoBlack}  = icons;


const toolbarActions = [
  {title: 'Add photo', icon: checkWhite, show: 'always'},
];
const toolsActions = [
  {title: 'Add photo', icon: cropBlack, show: 'always'},
  {title: 'Add photo', icon: undoBlack, show: 'always'},
  {title: 'Add photo', icon: redoBlack, show: 'always'},
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
  src;
  disabled;
}
export default class ThresholdComponent extends Component<ScreenNavigationProp, ThresholdS> {
  navigation;

  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    const src = props.navigation.state.params && props.navigation.state.params.src;
    this.state = {
      value: 85,
      src,
      disabled: false,
    };
  }

  onActionSelected = (action) => {
    if (action == 0) {
      const {src: filePath, value, disabled} = this.state;
      readThresholdSave(filePath, filePath + 'bw.png', disabled ? -1 : value)
        .then(e => {
          const {note} = this.props.navigation.state.params;
          note.image = e.uri;
          this.navigation.dispatch(goBack(note));
        });
    }
  };

  render() {
    const {value, disabled} = this.state;
    return <View style={{flex: 1}}>
      <Toolbar title="Threshold" actions={toolbarActions} color="white" backgroundColor="#01B47C"
               onActionSelected={this.onActionSelected}/>
      <View style={{flex: 1}}>
        <PhotoView src={this.state.src} value={disabled ? -1 : value} style={{flex:1}}/>
        <View style={{margin: 5}}>
          <CheckBox onClick={() => this.setState({disabled: !disabled})} isChecked={disabled}/>
          <Text>{value}</Text>
          <Slider onSlidingComplete={value => this.setState({value})}
                  value={this.state.value} minimumValue={1} maximumValue={100}/>
        </View>
      </View>
      <Toolbar actions={toolsActions} color="black" backgroundColor="white"
               onActionSelected={null}/>
    </View>
  }
}

const css = StyleSheet.create({});