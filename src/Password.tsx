import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  Share,
  TextStyle,
  ViewStyle,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from 'react-native';
import Toolbar from "./components/Toolbar";
import icons from './components/Icons'
import {range} from "./util/util";
import {CircleButton} from "./components/CircleButton";
const {editWhite, shareWhite, arrowWhite, deleteIconWhite} = icons;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

export class Circle extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      r: 0,
      rEnd: 6
    };
  }

  componentWillMount() {
    LayoutAnimation.configureNext({
      duration: 400,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
    });
    this.setState({r: this.state.r + this.state.rEnd});
  };

  render() {
    const {size} = this.props;
    const {r} = this.state;
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={[{height: size, width: size}, style]}>
          <View style={{borderRadius: r, width: r * 2, height: r * 2, backgroundColor: 'white'}}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const style = {justifyContent: 'center', alignItems: 'center'};


interface PasswordP {
}
interface PasswordS {
  pass: string;
}
export default class Password extends React.Component<PasswordP, PasswordS> {
  timer;

  constructor(props) {
    super(props);
    this.state = {
      pass: '',
    };
  }

  onPress = (k) => () => {
    window.clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({pass: '•'.repeat(this.state.pass.length)});
    }, 500);
    this.setState({pass: this.state.pass + k})
  };

  renderTouchpad = () => {
    let k = 0;
    return range(1, 4).map(j => {
      return <View key={j} style={css.buttonRow}>{
        range(0, 3).map(i => {
          k++;
          return <CircleButton key={i} title={k} size={92} color="white" highlight="#019967" backgroundColor="#01B47C" onPress={this.onPress(k)} />
        })
      }</View>;
    });
  };

  render() {
    const {pass} = this.state;
    return (
      <View style={css.container}>
        <Toolbar title="Note" color="white" backgroundColor="#01B47C"
                 navIcon={arrowWhite} />
        <View style={css.password}>
          <View style={{flex: 3}}/>
          <View style={{flex: 3, alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              {range(0, pass.length).map(i => <Circle key={i} size={16} />)}
            </View>
          </View>
          <View style={{flex: 3, borderColor: 'green', borderWidth: 1}}>
            <CircleButton title={'<='} size={48} backgroundColor="#01B47C" onPress={null}>
              <Text style={{color: 'white', fontSize: 23}}>{'<='}</Text>
            </CircleButton>
          </View>
        </View>
        {this.renderTouchpad()}
      </View>
    )
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#01B47C',
  } as ViewStyle,
  buttonRow: {
    flexDirection: 'row',
  } as ViewStyle,
  button: {
    fontSize: 20,
    color: 'white',
  },
  password: {
    flexDirection: 'row',
  } as ViewStyle,
  passwordText: {
    fontSize: 23,
    color: 'white',
  }
});