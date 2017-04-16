import * as React from 'react';
import {
  View, Text, ScrollView, TouchableNativeFeedback, StyleSheet, ViewStyle, TextStyle, Image,
} from 'react-native';
const nativeImageSource = require('nativeImageSource');
import {Icon, paths} from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";
import {connect} from "react-redux";
import {selectFilter, FilterState, Filter} from "../reducers/filter";
import {gray, green} from "../constants/theme";
import {delay} from "../constants/Config";
import DialogAndroid from 'react-native-dialogs';
import {NoteState} from "../reducers/notes";
import {equalObject, notEqualArray} from "../util/equalsCheck";
import l from '../constants/Localization';
import {IReduxProp} from "../declaration/types";
import {ActionFilter} from "../constants/ActionFilter";
const L = l.DrawerMenu;

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

interface TagsLayerP extends ScreenNavigationProp, IReduxProp {
  filter: FilterState;
  notes: NoteState;
}
interface TagsLayerS {
}
class FilterTags extends React.Component<TagsLayerP, TagsLayerS> {
  layout;

  constructor(props: TagsLayerP) {
    super(props);
  }

  shouldComponentUpdate(nextProps: TagsLayerP, nextState: TagsLayerS) {
    const {notes} = this.props;
    return (
      !equalObject(this.props.filter, nextProps.filter) ||

      nextProps.notes.some(nextNote => {
        const note = notes.find(e => e.id === nextNote.id);
        return !note || notEqualArray(note.tags, nextNote.tags)
      })
    );
  }

  setFilter = (id) => {
    const {filter, navigation, dispatch} = this.props;
    filter.current != id && dispatch(ActionFilter.setCurrentFilter(id));
    navigation.navigate('DrawerClose');
  };

  goToEditFilter = id => () => {
    const {dispatch, navigation} = this.props;
    if (id < 0) {
      navigation.navigate('EditFilter', {id});
      return;
    }
    showDialog().then(selectedId => {
      switch (selectedId) {
        case 0:
          navigation.navigate('EditFilter', {id});
          break;
        case 1:
          dispatch(ActionFilter.removeFilter(id));
          dispatch(ActionFilter.setCurrentFilter(-1));
          navigation.navigate('DrawerClose');
          break;
      }
    }).catch(e => {
      console.log(e);
    })
  };

  openSettings = () => {
    this.props.navigation.navigate('Settings');
  };

  sortItems(filters: Filter[]): Filter[] {
    const first = filters.find(e => e.id == -1);
    const last = filters.find(e => e.id == -2);
    [first, last].forEach(el => {
      filters.splice(filters.indexOf(el), 1);
    });
    const sorted = filters.sort(wsort);
    sorted.unshift(first);
    sorted.push(last);
    return sorted;
  }

  onLayout = ({nativeEvent: {layout}}) => {
    this.layout = layout;
  };

  render() {
    const {filters, current} = this.props.filter;
    const width = this.layout && this.layout.width;
    return <View style={css.container} onLayout={this.onLayout}>
      <ScrollView>
        <View style={css.headerImage}>
          <Image
            source={require('../../../assets/header.jpg')}
            style={{width, flex: 1}}
            resizeMode="cover"
          />
        </View>
        {this.sortItems(filters).map(e => (
          <Item
            key={e.id} data={e}
            selected={current == e.id}
            onPress={this.setFilter.bind(this, e.id)}
            onLongPress={e.id > -1 ? this.goToEditFilter(e.id) : null}
          />
        ))}
      </ScrollView>

      <View style={css.section}>
        <GrayButton title={L.buttons.addFilter} onPress={this.goToEditFilter(-1)} icon={paths.addWhite}/>
        <GrayButton title={L.buttons.settings} onPress={this.openSettings} icon={paths.settingsWhite}/>
      </View>
    </View>
  }
}

export default connect(state => ({
  notes: state.notes,
  filter: selectFilter(state),
}))(FilterTags);

function GrayButton({title, onPress, icon}) {
  return <TouchableNativeFeedback onPress={onPress} style={css.container}>
    <View style={css.item}>
      <Icon uri={icon} tint={gray} style={css.icon}/>
      <Text style={css.title}>{title}</Text>
    </View>
  </TouchableNativeFeedback>;
}

function maxCount(count) {
  return count != null ? (count < 100 ? count : '99+') : null;
}
interface ItemP {
  data: Filter;
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
  const textStyle = [css.title, selected && css.titleHighlight];
  return <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress}
                                  style={css.container} delayLongPress={delay}>
    <View style={[css.item, selected && css.itemHighlight]}>
      <Icon
        uri={icon}
        tint={[selected ? green : gray]}
        style={css.icon}
      />
      <View style={css.textWrapper}>
        <Text style={textStyle} numberOfLines={1}>
          {data.title}
        </Text>
        <Text style={textStyle} numberOfLines={1}>
          {maxCount(data.noteCount)}
        </Text>
      </View>
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

  headerImage: {
    flex: 1,
    height: 180,
    marginBottom: 8,
  },
  header: {
    // flexDirection: 'row',
    // justifyContent: 'stretch',
    // height: 150,
    paddingBottom: 8,
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
  } as ViewStyle,
  itemHighlight: {
    backgroundColor: 'rgba(1,180,124,.05)'
  },
  icon: {
    marginRight: 16
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  } as ViewStyle,

  section: {
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,.05)',
    paddingVertical: 8,
  } as ViewStyle,
});