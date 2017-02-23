import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  Vibration,
  ToolbarAndroid,
  Image,
} from 'react-native';
import {
  FloatingActionButton,
  NestedScrollView,
  CoordinatorLayout,
  BottomSheetBehavior,
} from 'react-native-bottom-sheet-behavior';
import store from "./redux/Store";
import Note from "./Note";
import {ActionOther, Actions} from "./redux/Actions";
const nativeImageSource = require('nativeImageSource');

const delay = __DEV__ ? 3000 : 1000;

const toolbarActionsItems = [
  {title: 'Delete', icon: nativeImageSource({
    android: 'ic_delete_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'},
];
const toolbarActions = [
  {title: 'Search', icon: nativeImageSource({
    android: 'ic_search_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'},
  {title: 'Sorting', icon: nativeImageSource({
    android: 'ic_sort_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'},
];
const backIcon = nativeImageSource({
  android: 'ic_arrow_back_black_24dp',
  width: 24,
  height: 24
});

interface NoteListS {
  dataSource?;
  multi?;
  selected?;
  sorting?: 'name' | 'date';
  filter: boolean;
  search: string;
}
export default class NoteList extends Component<any, NoteListS> {

  static navigationOptions = {
    header: {
      visible: false,
    }
  };
  private disp;
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.ds.cloneWithRows(store.getState().notes),
      multi: false,
      filter: false,
      search: '',
      selected: [],
      sorting: 'date'
    };
  }

  componentWillMount() {
    this.disp = store.subscribe((e) => {
      const {notes, other} = store.getState();
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
    const {notes} = store.getState();
    const {filter} = this.state;
    this.setState({
      filter: !filter,
      search: '',
      dataSource: this.ds.cloneWithRows(notes)
    });
  };

  toggleSort = () => {
    const sorting = this.state.sorting === 'date' ? 'name' : 'date';
    const {notes} = store.getState();
    let sorted = sorting === 'name'
      ? notes.sort((a: Note, b) => a.title > b.title)
      : notes.sort((a: Note, b) => a.createdAt > b.createdAt);
    this.setState({
      sorting,
      dataSource: this.ds.cloneWithRows(sorted)
    });
  };

  removeItems(ids) {
    Actions.removes(ids);
    this.disableMultiSelect();
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

  pressHandler = (multi, id) => (() => {
    const { navigate } = this.props.navigation;
    if (multi) {
      let {selected} = this.state;
      if (selected.includes(id)) {
        selected = selected.filter(e => e != id);
      } else {
        selected.push(id);
      }
      this.setState({selected});
    } else {
      navigate('NoteEdit', {id: id})
    }
  });

  renderRow = (rowData: Note) => {
    const {id, image, title} = rowData;
    const {selected, multi} = this.state;
    const isSelected = selected.includes(id);
    return (
      <TouchableNativeFeedback onPress={this.pressHandler(multi, id)}
                               onLongPress={this.longPressHandler.bind(null, id)}
                               delayLongPress={delay}>
        <View style={[css.item, isSelected ? css.selectedItem : null]}>
          <View style={css.imagePrevWrapper}>
            {image != null ?
              <Image source={{uri: image}} style={css.imagePrev}/>
              : null}
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
        this.toggleSort();
      }
    }
  };

  onChange = (search) => {
    const {notes} = store.getState();
    const searchLower = search.toLowerCase();
    const filtered = notes.filter((e: Note) => e.title.toLowerCase().indexOf(searchLower) >= 0);
    this.setState({
      search,
      dataSource: this.ds.cloneWithRows(filtered)
    });
  };

  renderSearchInput = () => {
    return <View style={css.search}>
      <TextInput type="text"
                 placeholder="Title"
                 value={this.state.search}
                 onChangeText={this.onChange}
                 style={css.searchInput}
      />
    </View>;
  };

  renderToolBar = () => {
    const multi = this.state.multi;
    const navIcon = multi ? backIcon : null;
    return <ToolbarAndroid
      elevation={5}
      actions={multi ? toolbarActionsItems : toolbarActions}
      style={css.toolbar}
      title={multi ? "Select to remove" : 'Title'}
      onIconClicked={this.onActionSelected}
      onActionSelected={this.onActionSelected}
      navIcon={navIcon}
    />
  };

  render() {
    const {filter} = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={css.container}>
        {this.renderToolBar()}
        {filter ?
          this.renderSearchInput() :
          null}
        <ScrollView>
          <ListView enableEmptySections
                    contentContainerStyle={css.listView}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
          />
        </ScrollView>

        <FloatingActionButton ref="fab" style={css.button} onPress={() => navigate('NoteEdit')}/>
      </View>
    );
  }
}


const css = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    backgroundColor: '#fff',
    height: 56,
  },
  listView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  toolBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
  },
  selectedItem: {
    backgroundColor: '#ddd',
  },
  imagePrevWrapper: {
    width: 50,
    height: 50
  },
  imagePrev: {
    width: 50,
    height: 50,
    margin: 5
  },
  text: {
    flex: 1,
    padding: 20,
    fontSize: 17,
    color: 'black',
  },
  search: {
    height: 56,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1
  },
  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    right: 20,
    bottom: 20,
  }
});