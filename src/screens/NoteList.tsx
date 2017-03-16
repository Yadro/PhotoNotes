import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
  Vibration,
  Alert,
  ViewStyle,
  ToolbarAndroidAction,
  Image,
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
const {toolbar, sortCreate, sortEdit, sortName} = l.NoteList;
const {remove, removeMulti} = l.Alert;

const {deleteIconWhite, searchWhite, moreWhite, closeWhite} = icons;

const delay = __DEV__ ? 3000 : 1000;

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

  constructor(props) {
    super(props);
    const notes = props.notes;
    this.state = {
      dataSource: this.ds.cloneWithRows(notes),
      multi: false,
      filter: false,
      search: '',
      selected: [],
      sorting: 'edit',
      reverse: false,
    };
  }

  componentWillReceiveProps(newProps: NoteListP) {
    const {props} = this;
    const {notes, tag} = newProps;

    const checker = check(tag);
    const filteredNotes = notes.filter(n => checker(n.tags));

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
    const {notes} = this.props;
    const sort = {
      'name': (items) => items.sort((a: Note, b) => ((reverse) ? a.title > b.title : a.title < b.title) ? 1 : a.title == b.title ? 0 : -1),
      'create': (items) => items.sort((a: Note, b) => ((reverse) ? a.createdAt - b.createdAt : b.createdAt + a.createdAt)),
      'edit': (items) => items.sort((a: Note, b) => ((reverse) ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt)),
    };

    if (sort[sortBy]) {
      const sorted = sort[sortBy](notes);
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
    const { navigate } = this.props.navigation;
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

  static renderPreviewCircle(text: string = '') {
    const symbols = text.split(/\s+/).map(e => e.charAt(0).toUpperCase()).join('').substr(0, 2);
    return <View style={css.previewContainer}>
      <View style={css.previewContainerWrapper}>
        <Text style={css.preview}>{symbols}</Text>
      </View>
    </View>;
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    console.log(sectionID, rowID);
    return <View key={`${sectionID}-${rowID}`} style={css.separator}/>
  }

  renderRow = (rowData: Note) => {
    const {id, image, title, images} = rowData;
    const {selected} = this.state;
    const isSelected = selected.includes(id);
    const thumbnail = images && images.thumbnail && images.thumbnail['50'] || image;
    return (
      <TouchableNativeFeedback onPress={this.pressHandler(id)}
                               onLongPress={this.longPressHandler.bind(null, id)}
                               delayLongPress={delay}>
        <View style={[css.item, isSelected ? css.selectedItem : null]}>
          <View style={css.imagePrevWrapper}>
            {!!thumbnail ?
              <Image source={{uri: thumbnail}} style={css.imagePrev}/> :
              NoteList.renderPreviewCircle(title)}
          </View>
          <Text style={css.text}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    );
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
        // this.props.navigation.navigate('Trash');
      }
    }
  };

  render() {
    console.log('render');

    const {multi} = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={css.container}>
        <Toolbar title={multi ? "Select to remove" : 'edditr'}
                 navIcon={multi ? closeWhite : null}
                 overflowIcon={moreWhite}
                 color="white" backgroundColor="#01B47C"
                 onActionSelected={this.onActionSelected}
                 actions={multi ? toolbarActionsItems : toolbarMainItems}
        />
        <ListView style={{backgroundColor: 'white'}} enableEmptySections
                  dataSource={this.state.dataSource} renderRow={this.renderRow}/>
        <ActionButton buttonColor="rgba(231,76,60,1)"
                      onPress={() => {navigate('NoteEdit')}}/>
      </View>
    );
  }
}

export default connect(state => ({notes: state.notes, tag: '!trash'}))(NoteList);


const check = (tag: string) => {
  let include;
  let query;
  if (tag.charAt(0) == '!') {
    include = false;
    query = tag.substr(1);
  } else {
    include = true;
    query = tag;
  }
  return (values: string[]) => {
    const res = values.indexOf(query);
    return include ? res > -1 : res == -1;
  };
};

const css = StyleSheet.create({
  container: {
    flex: 1,
  },

  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dedede'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    flex: 1,
    fontSize: 17,
    color: 'black',
  },
  selectedItem: {
    backgroundColor: '#ddd',
  },

  /** Image preview */
  imagePrevWrapper: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  imagePrev: {
    width: 50,
    height: 50,
    margin: 5
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

  /** Circle */
  previewContainer: {
    borderRadius: 21,
    width: 42,
    height: 42,
    backgroundColor: '#01B47C'
  },
  previewContainerWrapper: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  preview: {
    fontSize: 20,
    color: '#fff',
  },

  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    right: 20,
    bottom: 20,
  }
});