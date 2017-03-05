import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  ScrollView,
  TouchableNativeFeedback,
  View,
  Text,
} from 'react-native';


interface PopupMenuP {
}
interface PopupMenuS {
}
export default class PopupMenu extends React.Component<PopupMenuP, PopupMenuS> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={css.wrapper}>
        <View elevation={5} style={css.container}>
          <ScrollView>
            <TouchableNativeFeedback>
              <View>
                <Text style={css.text}>PopupMenu</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback>
              <View>
                <Text style={css.text}>PopupMenu</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback>
              <View>
                <Text style={css.text}>PopupMenu</Text>
              </View>
            </TouchableNativeFeedback>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const css = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  } as ViewStyle,
  container: {
    position: 'absolute',
    borderRadius: 3,
    backgroundColor: 'white',
    zIndex: 1000,
  } as ViewStyle,
  text: {
    padding: 15,
    fontSize: 15,
    color: 'black'
  }
});