import * as React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProperties,
} from 'react-native';

export interface InputSelection {
  start: number;
  end: number;
}
interface AutoExpandingTextInputP extends TextInputProperties {
  value: string;
  onChangeText;
}
interface AutoExpandingTextInputS {
  text;
  height;
}
export default class AutoExpandingTextInput extends React.Component<AutoExpandingTextInputP, AutoExpandingTextInputS> {

  constructor(props) {
    super(props);
    this.state = {
      text: props.value,
      height: 0,
    };
  }

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps');
    this.setState({text: props.value});
  }

  setPosition = ({nativeEvent: {selection}}) => {
    this.props.onChangeText({value: this.state.text, selection});
  };

  render() {
    return (
      <TextInput
        {...this.props}
        multiline
        blurOnSubmit={false}
        onSelectionChange={this.setPosition}
        onChangeText={(text) => {this.setState({text})}}
        onContentSizeChange={(event) => {
          this.setState({height: event.nativeEvent.contentSize.height});
        }}
        style={{height: Math.max(35, this.state.height)}}
        value={this.state.text}
      />
    );
  }
}