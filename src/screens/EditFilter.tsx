import * as React from 'react';
import {append} from 'ramda';
import {View, Picker, TextInput, ListView, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import {FilterState} from "../redux/filter";
import {CheckboxItem} from "../components/CheckboxItem";
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";
import {Actions} from "../redux/Actions";
const {checkWhite} = icons;

interface EditFilterP extends ScreenNavigationProp {
  filter: FilterState;
}
interface EditFilterS {
  id;
  title;
  newItem;
  type;
  dataSource;
  data;
}

const actions = [{
  title: 'Ok',
  icon: checkWhite,
  show: 'always',
  onPress: function() {
    const {title, type, data, id} = this.state;
    const filter = {
      title,
      type,
      tags: data.filter(e => e.value).map(e => e.title),
    };
    if (filter.tags.length) {
      if (id > -1) {
        Actions.updateFilter(id, filter);
      } else {
        Actions.addFilter(filter);
      }
    } else {
      // todo alert
    }
    this.props.navigation.goBack();
  }
}];

class EditFilter extends React.Component<EditFilterP, EditFilterS> {
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  constructor(props: EditFilterP) {
    super(props);
    const {id} = props.navigation.state.params || {} as any;
    const data = props.filter;
      let filter;
      let items;
    if (id != null && id > -1) {
      filter = data.filters[id];
    } else {
      filter = {};
    }
    items = Array.from(
      data.filters.reduce((res, item) => {
        item.tags.forEach(e => res.add(e));
        return res;
      }, new Set())
    ).map(e => ({
      title: e,
      value: filter.tags && filter.tags.indexOf(e) > -1 || false,
    }));
    this.state = {
      id,
      title: filter.title || '',
      type: filter.type || 'white',
      data: items,
      dataSource: this.ds.cloneWithRows(items),
      newItem: '',
    };
  }

  onCheckboxPress = (i) => {
    const {data} = this.state;
    return () => {
      data[i].value = !data[i].value;
      const {title} = this.state;
      this.setState({
        title: title || data[i].value && data[i].title || '',
        data,
        dataSource: this.ds.cloneWithRows(data)
      });
    }
  };

  onSubmitItem = (e) => {
    const title = e.nativeEvent.text;
    if (title != '') {
      const {data} = this.state;
      const newData = append({title, value: true}, data);
      this.setState({
        data: newData,
        dataSource: this.ds.cloneWithRows(newData),
        newItem: '',
      });
    }
  };

  toolbarAction = (actionId) => {
    if (actionId != null) {
      actions[actionId] && actions[actionId].onPress.call(this);
    }
  };

  render() {
    return <View style={css.container}>
      <Toolbar title="Filter" color="white" backgroundColor="#01b47c"
               actions={actions} onActionSelected={this.toolbarAction}/>
      <TextInput style={css.input} value={this.state.title} placeholder="Title"
                 onChangeText={(text) => this.setState({title: text})}/>
      <View style={{marginHorizontal: 8}}>
        <Picker
          mode="dropdown"
          selectedValue={this.state.type}
          onValueChange={(type) => this.setState({type})}>
          <Picker.Item label="White list" value="white"/>
          <Picker.Item label="Black list" value="black"/>
        </Picker>
      </View>
      <View>
        <ListView
          dataSource={this.state.dataSource} enableEmptySections
          renderRow={(rowData, e, i) => <CheckboxItem key={i} onPress={this.onCheckboxPress(i)}
                                                     title={rowData.title} value={rowData.value}/>}
        />
      </View>
      <TextInput style={css.input} value={this.state.newItem} placeholder="Add new tag..."
                 onChangeText={(text) => this.setState({newItem: text})} onSubmitEditing={this.onSubmitItem}/>
    </View>
  }
}

export default connect(state => ({filter: state.filter}))(EditFilter);

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    marginHorizontal: 8
  }
});