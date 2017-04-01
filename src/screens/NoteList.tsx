import * as React from 'react';
import {Component} from 'react';
import {StyleSheet, View, ListView, Vibration, Alert, ListViewDataSource} from 'react-native';
import {ScreenNavigationProp} from "react-navigation";
import ActionButton from 'react-native-action-button';
import Note from "../redux/Note";
import {Actions} from "../redux/Actions";
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons'
import l from '../constants/Localization';
import {connect} from "react-redux";
import List from "./List";
import {tracker} from "../Analytics";
import {Filter, selectCurrentFilter, selectFilter} from "../reducers/filter";
import {selectNotes} from "../reducers/notes";
import DialogAndroid from 'react-native-dialogs';
const {toolbar} = l.NoteList;
const {removeMulti} = l.Alert;

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
  title: 'Сортировка', show: 'never',
  onPress: function() {
    this.showSortAlert();
  },
}];

function showSortDialog(selectedIndex) {
  return new Promise((resolve, reject) => {
    try {
      const dialog = new DialogAndroid();
      dialog.set({
        selectedIndex,
        items: ['По алфавиту', 'По дате создания', 'По дате изменения'],
        itemsCallbackSingleChoice(id) {
          resolve(id);
        },
        positiveText: 'Ok',
      });
      dialog.show();
    } catch (err) {
      reject(err);
    }
  });
}

const SortMethods = ['name', 'create', 'edit'];
type SortMethod = 'name' | 'create' | 'edit';
interface NoteListP extends ScreenNavigationProp {
  filter: Filter;
  notes: Note[];
}
interface NoteListS {
  dataSource: ListViewDataSource;
  multi: boolean;
  selected: number[];
  sortMethod: SortMethod;
  reverse: boolean;
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

  constructor(props: NoteListP) {
    super(props);
    const sortMethod = 'create';
    const reverse = false;
    const sorted = sort[sortMethod](props.notes, reverse);
    this.state = {
      dataSource: this.ds.cloneWithRows(sorted),
      multi: false,
      search: '',
      selected: [],
      sortMethod,
      reverse,
    };
    if (!__DEV__) tracker.trackScreenView('NoteList');
  }

  componentWillReceiveProps(newProps: NoteListP) {
    console.log(newProps.notes);
    const {sortMethod, reverse} = this.state;

    // fixme
    /*if (notes.length == props.notes.length &&
      notes.every(note => Note.equalNeedUpdate(note, props.notes.find(e => e.id == note.id)))) {
      if (filterUpdate) {
        this.forceUpdate();
      }
      return;
    }*/

    this.setState({
      dataSource: this.ds.cloneWithRows(sort[sortMethod](newProps.notes, reverse))
    });
  }

  disableMultiSelect = () => {
    this.setState({multi: false, selected: []})
  };

  toggleSearch = () => {
    this.props.navigation.navigate('Search');
  };

  toggleSort = (sortBy: SortMethod, reverse) => {
    if (sort[sortBy]) {
      const {notes} = this.props;
      const sorted = sort[sortBy](notes, reverse);
      this.setState({
        reverse,
        sortMethod: sortBy,
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
        selected = selected.filter(e => e != id); // exclude selected note
      } else {
        selected.push(id); // add selected note
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
    const {reverse, sortMethod} = this.state;
    showSortDialog(SortMethods.indexOf(sortMethod)).then((id: number) => {
      if (SortMethods.indexOf(id)) {
        this.toggleSort(SortMethods[id] as SortMethod, reverse);
      }
    });

    /*PopupMenu.showRadio('Сортировка', '', ['ok'], {text: 'инверитровать', value: reverse},
      ['По алфавиту', 'По дате создания', 'По дате изменения'], (e) => {
        const sort = ['name', 'create', 'edit'];
        if (sort.indexOf(e.which)) {
          this.toggleSort(sort[e.which] as SortMethod, e.checkbox);
        }
      });*/
  };

  render() {
    console.log('render');

    const {filter} = this.props;
    const {multi, dataSource, selected} = this.state;
    const {navigate} = this.props.navigation;
    return (
      <View style={css.container}>
        <Toolbar title={multi ? "Select to remove" : filter.title}
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

export default connect(state => {
  const filter = selectFilter(state);
  const currentFilter = selectCurrentFilter(filter);
  return {
    filter: currentFilter,
    notes: selectNotes(state, currentFilter),
  };
})(NoteList);


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