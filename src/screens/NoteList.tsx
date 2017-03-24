import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Vibration,
  Alert,
  ToolbarAndroidAction,
  NativeModules,
} from 'react-native';
import {ScreenNavigationProp} from "react-navigation";
import ActionButton from 'react-native-action-button';
import Note from "../redux/Note";
import {Actions} from "../redux/Actions";
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons'
import l from './Localization';
import {connect} from "react-redux";
import List from "./List";
import {check} from "../util/tagUtil";
import {tracker} from "../Analytics";
const {toolbar, sortCreate, sortEdit, sortName} = l.NoteList;
const {remove, removeMulti} = l.Alert;
const {PopupMenu} = NativeModules;

const {deleteIconWhite, searchWhite, moreWhite, closeWhite, menuWhite} = icons;

const toolbarActionsItems = [{
  title: toolbar.remove, icon: deleteIconWhite, show: 'always',
  onPress: function () {
    this.removeItems(this.state.selected);
  },
}];
const toolbarMainItems = [{
  title: toolbar.search, icon: searchWhite, show: 'always',
  onPress: function() {
    this.toggleSearch();
  },
}, {
  title: 'Сортировка...', show: 'never',
  onPress: function() {
    this.showSortAlert();
  },
}, {
  title: 'Корзина', show: 'never',
  onPress: function() {
    this.props.navigation.navigate('Trash');
  },
}, {
  title: 'Настройки', show: 'never',
  onPress: function() {
    this.props.navigation.navigate('Settings');
  },
}, {
  title: 'EditFilter', show: 'never',
  onPress: function() {
    this.props.navigation.navigate('EditFilter');
  },
}];

type SortMethod ='name' | 'create' | 'edit';
interface NoteListP extends ScreenNavigationProp {
  notes: Note[];
  tag: string;
}
interface NoteListS {
  dataSource?;
  multi?;
  selected?;
  sorting?: SortMethod;
  reverse: boolean;
  filter: boolean;
  search: string;
}

const sort = {
  'name': (items, reverse) => items.sort((a: Note, b) => ((reverse) ? a.title < b.title : a.title > b.title) ? 1 : a.title == b.title ? 0 : -1),
  'create': (items, reverse) => items.sort((a: Note, b) => (reverse) ? a.createdAt - b.createdAt : b.createdAt - a.createdAt),
  'edit': (items, reverse) => items.sort((a: Note, b) => (reverse) ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt),
};

class NoteList extends Component<NoteListP, NoteListS> {
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
  check;

  constructor(props) {
    super(props);
    const notes = props.notes;
    this.check = check(props.tag);
    const sorting = 'create';
    const reverse = false;
    const filtered = notes.filter(n => this.check(n.tags));
    const sorted = sort[sorting](filtered, reverse);
    this.state = {
      dataSource: this.ds.cloneWithRows(sorted),
      multi: false,
      filter: false,
      search: '',
      selected: [],
      sorting,
      reverse,
    };
    if (!__DEV__) tracker.trackScreenView('NoteList');
  }

  componentWillReceiveProps(newProps: NoteListP) {
    const {sorting, reverse} = this.state;
    const {props} = this;
    const {notes} = newProps;
    const filtered = notes.filter(n => this.check(n.tags));

    if (filtered.length == props.notes.length &&
      filtered.every(note => Note.equalNeedUpdate(note, props.notes.find(e => e.id == note.id)))) {
      return;
    }

    this.setState({
      dataSource: this.ds.cloneWithRows(sort[sorting](filtered, reverse)),
    });
  }

  disableMultiSelect = () => {
    this.setState({multi: false, selected: []})
  };

  toggleSearch = () => {
    this.props.navigation.navigate('Search');
  };

  toggleSort = (sortBy: SortMethod, reverse) => {
    const {notes} = this.props;
    if (sort[sortBy]) {
      const filtered = notes.filter(n => this.check(n.tags));
      const sorted = sort[sortBy](filtered, reverse);
      this.setState({
        reverse,
        sorting: sortBy,
        dataSource: this.ds.cloneWithRows(sorted)
      });
    }
  };

  removeItems(ids) {
    Alert.alert(removeMulti.title, removeMulti.subtitle(ids.length), [{
      text: removeMulti.buttons.cancel,
      onPress: () => this.disableMultiSelect()
    }, {
      text: removeMulti.buttons.remove,
      onPress: () => {
        Actions.removes(ids);
        this.disableMultiSelect();
      }
    }], {cancelable: true});
  }

  longPressHandler = (id) => {
    const {selected} = this.state;
    selected.push(id);
    this.setState({
      multi: true,
      selected
    });

    Vibration.vibrate([0, 40], false);
  };

  pressHandler = (id) => () => {
    const {navigate} = this.props.navigation;
    if (this.state.multi) {
      let {selected} = this.state;
      if (selected.includes(id)) {
        selected = selected.filter(e => e != id);
      } else {
        selected.push(id);
      }
      this.setState({selected});
    } else {
      navigate('NoteView', {id: id})
    }
  };

  onActionSelected = (action) => {
    if (this.state.multi) {
      if (action == null) {
        this.disableMultiSelect();
      } else {
        toolbarActionsItems[action] && toolbarActionsItems[action].onPress.call(this);
      }
    } else {
      if (action == null) {
        this.props.navigation.navigate('DrawerOpen');
      } else {
        toolbarMainItems[action] && toolbarMainItems[action].onPress.call(this);
      }
    }
  };

  showSortAlert = () => {
    const {reverse} = this.state;
    PopupMenu.showRadio('Сортировка', '', ['ok'], {text: 'инверитровать', value: reverse},
      ['По алфавиту', 'По дате создания', 'По дате изменения'], (e) => {
        const sort = ['name', 'create', 'edit'];
        if (sort.indexOf(e.which)) {
          this.toggleSort(sort[e.which] as SortMethod, e.checkbox);
        }
      });
  };

  render() {
    console.log('render');

    const {multi, dataSource, selected} = this.state;
    const {navigate} = this.props.navigation;
    return (
      <View style={css.container}>
        <Toolbar title={multi ? "Select to remove" : 'edditr'}
                 navIcon={multi ? closeWhite : menuWhite}
                 overflowIcon={moreWhite}
                 color="white" backgroundColor="#01B47C"
                 onActionSelected={this.onActionSelected}
                 actions={multi ? toolbarActionsItems : toolbarMainItems}
        />
        <List dataSource={dataSource} selected={selected}
              pressHandler={this.pressHandler} longPressHandler={this.longPressHandler}/>
        <ActionButton buttonColor="rgba(231,76,60,1)"
                      onPress={() => {navigate('NoteEdit')}}/>
      </View>
    );
  }
}

export default connect(state => ({notes: state.notes, tag: '!trash'}))(NoteList);


const css = StyleSheet.create({
  container: {
    flex: 1,
  },

  /** Search */
  search: {
    height: 60,
    backgroundColor: '#f7f7f7',
  },
  searchBox: {
    flex: 1,
    margin: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    backgroundColor: '#f7f7f7',
  },
  titleLine: {
    height: 1,
    backgroundColor: '#ebebeb',
  },
});