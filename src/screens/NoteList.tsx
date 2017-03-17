import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Vibration,
  Alert,
  ToolbarAndroidAction,
} from 'react-native';
import {ScreenNavigationProp} from "react-navigation";
import ActionButton from 'react-native-action-button';
import store from "../redux/Store";
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

const {deleteIconWhite, searchWhite, moreWhite, closeWhite} = icons;

const toolbarActionsItems: ToolbarAndroidAction[] = [
  {title: toolbar.remove, icon: deleteIconWhite, show: 'always'},
];
const toolbarMainItems = [{
  title: toolbar.search, icon: searchWhite, show: 'always'
}, {
  title: sortName, show: 'never'
}, {
  title: sortCreate, show: 'never'
}, {
  title: sortEdit, show: 'never'
}, {
  title: 'Корзина', show: 'never'
}, {
  title: 'Настройки', show: 'never'
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

class NoteList extends Component<NoteListP, NoteListS> {
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
  check;

  constructor(props) {
    super(props);
    const notes = props.notes;
    this.check = check(props.tag);
    this.state = {
      dataSource: this.ds.cloneWithRows(notes.filter(n => this.check(n.tags))),
      multi: false,
      filter: false,
      search: '',
      selected: [],
      sorting: 'edit',
      reverse: false,
    };
    if (!__DEV__) tracker.trackScreenView('NoteList');
  }

  componentWillReceiveProps(newProps: NoteListP) {
    const {props} = this;
    const {notes} = newProps;
    const filteredNotes = notes.filter(n => this.check(n.tags));

    if (filteredNotes.length == props.notes.length &&
      filteredNotes.every(note => Note.equalNeedUpdate(note, props.notes.find(e => e.id == note.id)))) {
      return;
    }

    this.setState({
      dataSource: this.ds.cloneWithRows(filteredNotes),
    });
  }

  disableMultiSelect = () => {
    this.setState({multi: false, selected: []})
  };

  toggleSearch = () => {
    this.props.navigation.navigate('Search');
  };

  toggleSort = (sortBy: SortMethod) => {
    let reverse = !!this.state.reverse;
    if (sortBy == this.state.sorting) {
      reverse = !reverse;
    }
    const {notes, tag} = this.props;
    const sort = {
      'name': (items) => items.sort((a: Note, b) => ((reverse) ? a.title > b.title : a.title < b.title) ? 1 : a.title == b.title ? 0 : -1),
      'create': (items) => items.sort((a: Note, b) => ((reverse) ? a.createdAt - b.createdAt : b.createdAt - a.createdAt)),
      'edit': (items) => items.sort((a: Note, b) => ((reverse) ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt)),
    };

    if (sort[sortBy]) {
      const sorted = sort[sortBy](notes);
      const checker = check(tag);
      const filteredNotes = sorted.filter(n => checker(n.tags));
      this.setState({
        reverse,
        sorting: sortBy,
        dataSource: this.ds.cloneWithRows(filteredNotes)
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
      } else if (action == 0) {
        this.removeItems(this.state.selected);
      }
    } else {
      if (action == 0) {
        this.toggleSearch();
      } else if (action == 1) {
        this.toggleSort('name');
      } else if (action == 2) {
        this.toggleSort("create");
      } else if (action == 3) {
        this.toggleSort("edit");
      } else if (action == 4) {
        this.props.navigation.navigate('Trash');
      } else if (action == 5) {
        this.props.navigation.navigate('Settings');
      }
    }
  };

  render() {
    console.log('render');

    const {multi, dataSource, selected} = this.state;
    const {navigate} = this.props.navigation;
    return (
      <View style={css.container}>
        <Toolbar title={multi ? "Select to remove" : 'edditr'}
                 navIcon={multi ? closeWhite : null}
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