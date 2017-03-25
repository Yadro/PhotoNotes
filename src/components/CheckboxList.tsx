import * as React from 'react';
import {View, KeyboardAvoidingView, TextInput, ListView, StyleSheet, ViewStyle} from 'react-native';
import {append} from 'ramda';
import {CheckboxItem} from "./CheckboxItem";

interface CheckboxListP {
  style?;
  data;
  onChange;
  onAddItem;
}
interface CheckboxListS {
  data;
  dataSource;
  newItem;
}
export default class CheckboxList extends React.Component<CheckboxListP, CheckboxListS> {
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      dataSource: this.ds.cloneWithRows(props.data),
      newItem: '',
    };
  }

  onCheckboxPress = (i) => {
    const {data} = this.state;
    return () => {
      data[i].value = !data[i].value;
      this.props.onChange(data);
      this.setState({
        data,
        dataSource: this.ds.cloneWithRows(data)
      });
    }
  };

  onSubmitItem = (e) => {
    const title = e.nativeEvent.text;
    if (title != '') {
      const {data} = this.state;
      const item = {title, value: true};
      const newData = append(item, data);
      this.props.onAddItem(newData);
      this.setState({
        data: newData,
        dataSource: this.ds.cloneWithRows(newData),
        newItem: '',
      });
    }
  };

  renderItem(data, i) {
    return <CheckboxItem key={i}
                         title={data.title} value={data.value}
                         onPress={this.onCheckboxPress(i)}/>
  }

  render() {
    return <View style={[css.container, this.props.style]}>
      <ListView
        dataSource={this.state.dataSource} enableEmptySections
        renderRow={(data, e, i) => this.renderItem(data, i)}
      />
      <TextInput style={css.input} value={this.state.newItem} placeholder="Add new tag..."
                 onChangeText={text => this.setState({newItem: text})}
                 onSubmitEditing={this.onSubmitItem}/>
    </View >
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  bottomPosition: {
    position: 'absolute',
    flex: 1,
    height: 48,
    bottom: 0,
  } as ViewStyle,
  input: {
    marginHorizontal: 16
  }
});