import * as React from 'react';
import {View, Text, Picker, TextInput, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import {FilterState} from "../redux/filter";

interface EditFilterP {
  filter: FilterState;
}
interface EditFilterS {
  title;
  type;
}

class EditFilter extends React.Component<EditFilterP, EditFilterS> {

  constructor(props: EditFilterP) {
    super(props);
    let state;
    const data = props.filter;
    if (data.current > -1) {
      const filter = data.filters[data.current] || {};
      state = {
        title: filter.title ? filter.title : '',
        type: ''
      }
    }
    this.state = state;
  }

  render() {
    return <View style={css.container}>
      <TextInput value={this.state.title}/>
      <Picker
        mode="dropdown"
        selectedValue={this.state.type}
        onValueChange={(type) => this.setState({type})}>
        <Picker.Item label="White list" value="white" />
        <Picker.Item label="Black list" value="black" />
      </Picker>
    </View>
  }
}

export default connect(state => ({filter: state.filter}))(EditFilter);

const css = StyleSheet.create({
  container: {
    flex: 1,
  },

});