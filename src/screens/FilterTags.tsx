import * as React from 'react';
import {View, Text, ScrollView, TouchableNativeFeedback, StyleSheet} from 'react-native';
import icons from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";
import {connect} from "react-redux";
import {FilterState} from "../reducers/filter";
import store from "../redux/Store";
import {SET_CURRENT_FILTER} from "../constants/ActionTypes";
import {green} from "../constants/theme";
import {delay} from "../constants/Config";
const {editWhite} = icons;

interface TagsLayerP extends ScreenNavigationProp {
  filter: FilterState;
}
interface TagsLayerS {
}


class FilterTags extends React.Component<TagsLayerP, TagsLayerS> {

  setFilter = (id) => {
    store.getState().filter.current != id &&
      store.dispatch({type: SET_CURRENT_FILTER, current: id});
    this.props.navigation.navigate('DrawerClose');
  };

  goToEditFilter = id => () => {
    this.props.navigation.navigate('EditFilter', {id});
  };

  render() {
    const {current} = store.getState().filter;
    const {filters} = this.props.filter;
    return <View style={css.wrapper}>
      <ScrollView>
        {filters.sort(wsort).map((e, idx) => (
          <Item key={idx} title={e.title} selected={current == idx}
                onPress={this.setFilter.bind(this, idx)} onLongPress={this.goToEditFilter(idx)}/>
        ))}
      </ScrollView>
      <Item title={'Add new filter'} onPress={this.goToEditFilter(-1)}
            onLongPress={null} selected={false}/>
    </View>
  }
}

export default connect(state => ({filter: state.filter}))(FilterTags);

const Item = ({title, onPress, onLongPress, selected}) => {
  return <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress}
                                  style={css.container} delayLongPress={delay}>
    <View style={[css.item, selected && css.itemHighlight]}>
      {/*<Image source={{uri: editWhite}}/>*/}
      <Text style={[css.title, selected && css.titleHighlight]}>{title}</Text>
    </View>
  </TouchableNativeFeedback>
};

export function wsort(a, b) {
  return sortstr(a.title, b.title);
}
export function sortstr(a, b) {
  return a > b ? 1 : a == b ? 0 : -1;
}

const css = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginVertical: 8,
  },
  container: {
    flex: 1,
  },
  title: {
    color: 'black',
  },
  titleHighlight: {
    fontWeight: 'bold',
    color: green,
  },
  item: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  itemHighlight: {
    backgroundColor: 'rgba(0,0,0,.05)'
  }
});