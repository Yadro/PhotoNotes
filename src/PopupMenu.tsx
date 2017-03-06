import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  ScrollView,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';


interface PopupMenuP {
  items: {
    title;
    icon?;
    onPress;
  }[]
  icon?;
  open;
  onHideMenu;
}
interface PopupMenuS {
  open;
}
export default class PopupMenu extends React.Component<PopupMenuP, PopupMenuS> {

  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
  }

  componentWillReceiveProps(newProp) {
    this.setState({open: newProp.open});
  }

  onHideMenu = () => {
    this.props.onHideMenu && this.props.onHideMenu();
  };

  onPressItem = (fn) => {
    fn();
    this.props.onHideMenu && this.props.onHideMenu();
  };

  render() {
    const {open} = this.state;
    const {items} = this.props;
    if (!open) {
      return <View/>;
    }
    return (
      <TouchableWithoutFeedback onPress={this.onHideMenu}>
        <View style={[css.wrapper]}>
          <View elevation={5} style={css.container}>
            {items.map((e, i) => <PopupMenuItem key={i} title={e.title}
                                                onPress={this.onPressItem.bind(this, e.onPress)}/>)}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const PopupMenuItem = ({title, onPress}) =>
  <TouchableNativeFeedback onPress={onPress}>
    <View>
      <Text style={css.text}>{title}</Text>
    </View>
  </TouchableNativeFeedback>;

const css = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    bottom: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'black',
    zIndex: 1000,
  } as ViewStyle,
  container: {
    position: 'absolute',
    borderRadius: 3,
    top: 5,
    right: 5,
    backgroundColor: 'white',
    zIndex: 1000,
  } as ViewStyle,
  text: {
    padding: 15,
    fontSize: 15,
    color: 'black'
  }
});