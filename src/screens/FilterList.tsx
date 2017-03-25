import * as React from 'react';
import {View, Text, ScrollView, TouchableNativeFeedback, StyleSheet, ViewStyle} from 'react-native';
import icons, {Icon, paths} from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";
import {connect} from "react-redux";
import {selectFilter, FilterState} from "../reducers/filter";
import store from "../redux/Store";
import {SET_CURRENT_FILTER} from "../constants/ActionTypes";
import {gray, green} from "../constants/theme";
import {delay} from "../constants/Config";
import {Actions} from "../redux/Actions";

interface TagsLayerP extends ScreenNavigationProp {
  filter: FilterState;
}
interface TagsLayerS {
}


class FilterTags extends React.Component<TagsLayerP, TagsLayerS> {

  setFilter = (id) => {
    store.getState().filter.current != id &&
      Actions.setCurrentFilter(id);
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
        {filters.sort(wsort).map(e => (
          <Item key={e.id} title={e.title} selected={current == e.id}
                onPress={this.setFilter.bind(this, e.id)}
                onLongPress={e.id > -1 ? this.goToEditFilter(e.id) : null}/>
        ))}
      </ScrollView>

      <View style={css.section}>
        <TouchableNativeFeedback onPress={this.goToEditFilter(-1)} style={css.container}>
          <View style={css.item}>
            <Icon uri={paths.editWhite} tint={gray} style={css.icon}/>
            <Text style={css.title}>{'Add new filter'}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  }
}

export default connect(state => ({filter: selectFilter(state)}))(FilterTags);

interface ItemP {
  title
  onPress
  onLongPress?
  selected
}
const Item = (props: ItemP) => {
  const {title, onPress, onLongPress, selected} = props;
  return <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress}
                                  style={css.container} delayLongPress={delay}>
    <View style={[css.item, selected && css.itemHighlight]}>
      <Icon uri={selected ? paths.labelWhite : paths.labelOutlineWhite}
            tint={[selected ? green : gray]} style={css.icon}/>
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
    marginTop: 8,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
  titleHighlight: {
    fontWeight: 'bold',
    color: green,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
  },
  itemHighlight: {
    backgroundColor: 'rgba(1,180,124,.05)'
  },
  icon: {
    marginRight: 16
  },
  section: {
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,.05)',
    paddingVertical: 8,
  } as ViewStyle,
});