import * as React from 'react';
import {View, Text, ScrollView, TouchableNativeFeedback, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Icon, paths} from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";
import {connect} from "react-redux";
import {selectFilter, FilterState} from "../reducers/filter";
import store from "../redux/Store";
import {gray, green} from "../constants/theme";
import {delay} from "../constants/Config";
import {Actions} from "../redux/Actions";
import DialogAndroid from 'react-native-dialogs';

interface TagsLayerP extends ScreenNavigationProp {
  filter: FilterState;
}
interface TagsLayerS {
}


function showDialog() {
  return new Promise((resolve, reject) => {
    try {
      const dialog = new DialogAndroid();
      dialog.set({
        items: ['modify', 'delete'],
        itemsCallback(id) {
          resolve(id);
        },
      });
      dialog.show();
    } catch (err) {
      reject(err);
    }
  });
}

class FilterTags extends React.Component<TagsLayerP, TagsLayerS> {

  setFilter = (id) => {
    store.getState().filter.current != id &&
      Actions.setCurrentFilter(id);
    this.props.navigation.navigate('DrawerClose');
  };

  goToEditFilter = id => () => {
    if (id < 0) {
      this.props.navigation.navigate('EditFilter', {id});
      return;
    }
    showDialog().then(selectedId => {
      if (selectedId == 0) {
        this.props.navigation.navigate('EditFilter', {id});
      } else {
        Actions.removeFilter(id);
      }
    }).catch(e => {
      console.log(e);
    })
  };

  openSettings = () => {
    this.props.navigation.navigate('Settings');
  };

  render() {
    const {current} = store.getState().filter;
    const {filters} = this.props.filter;
    return <View style={css.container}>
      <ScrollView>
        <View style={css.header}>
          <Text style={css.headerTitle}>Edditr</Text>
        </View>
        {filters.sort(wsort).map(e => (
          <Item key={e.id} data={e}
                selected={current == e.id}
                onPress={this.setFilter.bind(this, e.id)}
                onLongPress={e.id > -1 ? this.goToEditFilter(e.id) : null}/>
        ))}
      </ScrollView>

      <View style={css.section}>
        <GrayButton title="Add new filter" onPress={this.goToEditFilter(-1)} icon={paths.editWhite}/>
        <GrayButton title="Settings" onPress={this.openSettings} icon={paths.settingsWhite}/>
      </View>
    </View>
  }
}

export default connect(state => ({filter: selectFilter(state)}))(FilterTags);

function GrayButton({title, onPress, icon}) {
  return <TouchableNativeFeedback onPress={onPress} style={css.container}>
    <View style={css.item}>
      <Icon uri={icon} tint={gray} style={css.icon}/>
      <Text style={css.title}>{title}</Text>
    </View>
  </TouchableNativeFeedback>;
}

interface ItemP {
  data;
  onPress
  onLongPress?
  selected
}
function Item(props: ItemP) {
  const {data, onPress, onLongPress, selected} = props;
  let icon;
  if (Array.isArray(data.icon)) {
    icon = selected ? data.icon[0] : data.icon[1]
  } else {
    icon = selected ? paths.labelWhite : paths.labelOutlineWhite
  }
  return <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress}
                                  style={css.container} delayLongPress={delay}>
    <View style={[css.item, selected && css.itemHighlight]}>
      <Icon
        uri={icon}
        tint={[selected ? green : gray]}
        style={css.icon}
      />
      <Text style={[css.title, selected && css.titleHighlight]} numberOfLines={1}>
        {data.title}
      </Text>
    </View>
  </TouchableNativeFeedback>
}

export function wsort(a, b) {
  return sortstr(a.title, b.title);
}
export function sortstr(a, b) {
  return a > b ? 1 : a == b ? 0 : -1;
}

const css = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    justifyContent: 'flex-end',
    height: 150,
    marginBottom: 8,
    backgroundColor: green,
  } as ViewStyle,
  headerTitle: {
    color: 'white',
    fontSize: 18,
    margin: 16
  } as TextStyle,

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