import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  Vibration,
  Alert,
  ViewStyle,
  ToolbarAndroidAction,
  Image,
} from 'react-native';
import {ScreenNavigationProp} from "react-navigation";
import ActionButton from 'react-native-action-button';
import store from "./redux/Store";
import Note from "./Note";
import {Actions} from "./redux/Actions";
import Toolbar from "./Toolbar";
import icons from './Icons'
import PopupMenu from "./PopupMenu";
import l from './Localization';
const {toolbar} = l.NoteList;
const {deleteIconWhite, searchWhite, sortWhite, moreWhite, arrowWhite, closeWhite, photoWhite, addToPhotosWhite} = icons;

const delay = __DEV__ ? 3000 : 1000;

const toolbarActionsItems: ToolbarAndroidAction[] = [
  {title: toolbar.remove, icon: deleteIconWhite, show: 'always'},
];
const toolbarMainItems = [{
  title: toolbar.search, icon: searchWhite, show: 'always'
}, {
  title: toolbar.menu, icon: moreWhite, show: 'always'
}];
const sorting = title => ({
  title: title, icon: sortWhite, show: 'always'
});

type SortMethod ='name' | 'create' | 'edit';
interface NoteListS {
  dataSource?;
  multi?;
  selected?;
  sorting?: SortMethod;
  reverse: boolean;
  filter: boolean;
  search: string;
  menu;
}
export default class NoteList extends Component<ScreenNavigationProp, NoteListS> {

  private disp;
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
  searchDelay;

  popupMenuItems = [{
    title: 'Sort by name',
    onPress: () => this.toggleSort('name')
  }, {
    title: 'Sort by create',
    onPress: () => this.toggleSort('create')
  }, {
    title: 'Sort by edit',
    onPress: () => this.toggleSort('edit')
  }, {
    title: 'About',
    onPress: () => null
  }];

  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.ds.cloneWithRows(store.getState().notes),
      multi: false,
      filter: false,
      search: '',
      selected: [],
      sorting: 'edit',
      reverse: false,
      menu: false,
    };
  }

  componentWillMount() {
    this.disp = store.subscribe(() => {
      const {notes} = store.getState();
      this.setState({
        dataSource: this.ds.cloneWithRows(notes),
      });
    });
  }

  componentWillUnmount() {
    this.disp();
  }

  disableMultiSelect = () => {
    this.setState({multi: false, selected: []})
  };

  toggleSearch = () => {
    this.props.navigation.navigate('Search');
    /* const {notes} = store.getState();
     const {filter} = this.state;
     this.setState({
       filter: !filter,
       search: '',
       dataSource: this.ds.cloneWithRows(notes)
     });*/
  };

  toggleSort = (sortBy: SortMethod) => {
    let reverse = !!this.state.reverse;
    if (sortBy == this.state.sorting) {
      reverse = !reverse;
    }
    const {notes} = store.getState();
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

  toggleMenu = () => {
    this.setState({menu: !this.state.menu});
  };

  removeItems(ids) {
    Alert.alert('Remove', `Remove ${ids.length} notes?`, [{
      text: 'cancel',
      onPress: () => this.disableMultiSelect()
    }, {
      text: 'remove',
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
        this.toggleMenu();
      }
    }
  };

  onChange = (search) => {
    const {notes} = store.getState();
    const searchLower = search.toLowerCase();
    const filtered = notes.filter((e: Note) => e.title.toLowerCase().indexOf(searchLower) >= 0);
    this.setState({search});

    window.clearTimeout(this.searchDelay);
    this.searchDelay = window.setTimeout(() => {
      this.setState({
        dataSource: this.ds.cloneWithRows(filtered)
      });
    }, 500);
  };

  renderSearchInput = () => {
    return <View style={css.search}>
      <View style={css.searchBox}>
        <TextInput placeholder="Search"
                   value={this.state.search}
                   onChangeText={this.onChange}
                   style={css.searchInput}/>
      </View>
      <View style={css.titleLine}/>
    </View>;
  };

  render() {
    const {filter, multi, menu} = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={css.container}>
        <Toolbar title={multi ? "Select to remove" : 'edditr'} navIcon={multi ? closeWhite : null}
                 color="white" backgroundColor="#01B47C"
                 onActionSelected={this.onActionSelected}
                 actions={multi ? toolbarActionsItems : toolbarMainItems}
        />
        {filter && this.renderSearchInput()}
        <ScrollView>
          <ListView enableEmptySections dataSource={this.state.dataSource} renderRow={this.renderRow}/>
        </ScrollView>
        <ActionButton buttonColor="rgba(231,76,60,1)"
                      onPress={() => {navigate('NoteEdit')}}/>
        <PopupMenu items={this.popupMenuItems} open={menu} onHideMenu={() => this.setState({menu: false})}/>
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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