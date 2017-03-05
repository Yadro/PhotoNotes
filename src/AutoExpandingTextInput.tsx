import * as React from 'react';
import {
  StyleSheet,
  TextInput,
} from 'react-native';

interface AutoExpandingTextInputP {
}
interface AutoExpandingTextInputS {
  text;
  height;
}
export default class AutoExpandingTextInput extends React.Component<any, AutoExpandingTextInputS> {

  constructor(props) {
    super(props);
    this.state = {
      text: props.value,
      height: 0,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({text: props.value});
  }

  render() {

    return (
      <TextInput
        {...this.props}
        multiline
        blurOnSubmit={false}
        onChangeText={(text) => {
          this.setState({text});
          this.props.onChangeText(text);
        }}
        onContentSizeChange={(event) => {
          this.setState({height: event.nativeEvent.contentSize.height});
        }}
        style={{height: Math.max(35, this.state.height)}}
        value={this.state.text}
      />
    );
  }
}