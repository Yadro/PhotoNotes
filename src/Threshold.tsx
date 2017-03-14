import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  Slider,
  StyleSheet,
  Image,
  ViewStyle,
} from 'react-native';
import {PhotoView, readThresholdSave} from '../android/PhotoModule/index.js';
import ImageResizer from 'react-native-image-resizer';
import {NavigationActions} from "react-navigation";
import {ScreenNavigationProp} from "react-navigation";
import CheckBox from 'react-native-check-box';
import Toolbar from "./Toolbar";
import icons from './Icons';
import store from "./redux/Store";
import {getSizeInContainer} from "./util/util";
import l from './Localization';
const {toolbar} = l.Threshold;
const {closeWhite, checkWhite, cropBlack, redoBlack, undoBlack}  = icons;


const toolbarActions = [
  {title: toolbar.ok, icon: checkWhite, show: 'always'},
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
    if (action == null) {
      this.navigation.goBack();
    }
    if (action == 0) {
      const {other: {size}} = store.getState();
      const {src: originPath, value, disabled} = this.state;
      const thresholdPath = originPath + 'bw.png';

      readThresholdSave(originPath, thresholdPath, disabled ? -1 : value)
        .then(e => {
          const {note} = this.props.navigation.state.params;
          note.image = e.uri;
          this.navigation.dispatch(goBack(note));
        });

        /*Image.getSize(e.uri, (width, height) => {
          const sizzer = getSizeInContainer(size, width, height);
          ImageResizer.createResizedImage(thresholdPath, sizzer.width, sizzer.height, 'JPEG', 100)
            .then((resizedImageUri) => {
            // todo
            //   note.images.thumbnail.fullscreen = resizedImageUri;
              this.navigation.dispatch(goBack(note));
            }).catch((err) => {
            this.navigation.dispatch(goBack(note));
          });
        }, (e) => {
          console.error(e);
        });*/
    }
  };

  render() {
    const {value, disabled} = this.state;
    return <View style={{flex: 1}}>
      <Toolbar title={toolbar.header} actions={toolbarActions} color="white" backgroundColor="#01B47C"
               navIcon={closeWhite} onActionSelected={this.onActionSelected}/>
      <View style={{flex: 1}}>
        <PhotoView src={this.state.src} value={disabled ? -1 : value} style={{flex:1}}/>
        <View style={css.slider}>
          <CheckBox style={{width: 36}} onClick={() => this.setState({disabled: !disabled})} isChecked={disabled}/>
          <Text style={{width: 26}}>{Math.floor(value)}</Text>
          <Slider style={{flex: 1}} onSlidingComplete={value => this.setState({value})}
                  value={this.state.value} minimumValue={1} maximumValue={100}/>
        </View>
      </View>
      {/*<Toolbar actions={toolsActions} color="black" backgroundColor="white"
       onActionSelected={null}/>*/}
    </View>
  }
}

const css = StyleSheet.create({
  slider: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle
});