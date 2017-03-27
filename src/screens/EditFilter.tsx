import * as React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import {selectFilter, FilterState} from "../reducers/filter";
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";
import {Actions} from "../redux/Actions";
import CheckboxList from "../components/CheckboxList";
import {green} from "../constants/theme";
import DropdownPicker from "../components/material/DropdownPicker";
const {checkWhite} = icons;

interface EditFilterP extends ScreenNavigationProp {
  filter: FilterState;
}
interface EditFilterS {
  id;
  title;
  newItem;
  type;
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
      id: 0,
    };
    if (filter.tags.length || filter.type == 'black') {
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

const pickerItems = [
  {label: "White list", value: "white"},
  {label: "Black list", value: "black"}
];

class EditFilter extends React.Component<EditFilterP, EditFilterS> {
  constructor(props: EditFilterP) {
    super(props);
    const {id} = props.navigation.state.params || {} as any;
    const data = props.filter;
    let filter;
    if (id != null && id > -1) {
      filter = data.filters.find(e => e.id == id);
    } else {
      filter = {};
    }
    const items = Array.from(
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
      newItem: '',
    };
  }

  onChange = (data) => {
    this.setState({data});
  };

  submitItem = (data) => {
    const {title} = this.state;
    this.setState({
      title: title || data[data.length - 1].title || '',
      data,
    });
  };

  toolbarAction = (actionId) => {
    if (actionId != null) {
      actions[actionId] && actions[actionId].onPress.call(this);
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    return <View style={css.container}>
      <Toolbar title="Filter"
               color="white"
               backgroundColor={green}
               navIcon={icons.arrowWhite}
               actions={actions} onActionSelected={this.toolbarAction}
      />
      <TextInput
        style={css.input}
        value={this.state.title} placeholder="Title"
        onChangeText={(text) => this.setState({title: text})}
      />
      <DropdownPicker
        title="Type of filter"
        items={pickerItems}
        value={this.state.type}
        onValueChange={(type) => this.setState({type})}
      />
      <Text style={css.hint}>Select tag</Text>
      <CheckboxList data={this.state.data} onAddItem={this.submitItem} onChange={this.onChange}/>
    </View>
  }
}

export default connect(state => ({filter: selectFilter(state)}))(EditFilter);

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    marginTop: 8,
    marginHorizontal: 14,
    fontSize: 20,
  },
  hint: {
    fontSize: 12,
    marginHorizontal: 16,
  }
});