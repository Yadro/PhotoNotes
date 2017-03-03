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
import {ScreenNavigationProp} from "react-navigation";
import store from "./redux/Store";
import Note from "./Note";
import {Actions} from "./redux/Actions";
import Toolbar from "./Toolbar";
import icons from './Icons'
const {deleteIcon, search, sort, arrow, photo} = icons;

const delay = __DEV__ ? 3000 : 1000;

const toolbarActionsItems = [
  {title: 'Delete', icon: deleteIcon, show: 'always'},
];
const searchIcon = {
  title: 'Search', icon: search, show: 'always'
};
const sorting = title => ({
  title: title, icon: sort, show: 'always'
});


interface NoteListS {
  dataSource?;
  multi?;
  selected?;
  sorting?: 'name' | 'date';
  filter: boolean;
  search: string;
}
export default class NoteList extends Component<ScreenNavigationProp, NoteListS> {

  static navigationOptions = {
    header: {
      visible: false,
    }
  };
  private disp;
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  searchDelay;

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

  pressHandler = (multi, id) => () => {
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
      navigate('NoteView', {id: id})
    }
  };

  renderPreview(text: string) {
    const symbols = text.split(/\s+/).map(e => e.charAt(0).toUpperCase()).join('').substr(0, 2);
    return <View style={css.previewContainer}>
      <View style={css.previewContainerWrapper}>
        <Text style={css.preview}>{symbols}</Text>
      </View>
    </View>;
  }

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
              <Image source={{uri: image}} style={css.imagePrev}/>:
              this.renderPreview(title)}
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
    const {filter, multi} = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={css.container}>
        <Toolbar title={multi ? "Select to remove" : 'Photo Notes'} navIcon={multi ? arrow : photo}
                 color="white" backgroundColor="#01B47C"
                 onActionSelected={this.onActionSelected}
                 actions={multi ? toolbarActionsItems : [searchIcon, sorting('Current sort: ' + this.state.sorting)]}
        />
        {filter && this.renderSearchInput()}
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

  previewContainer: {
    margin: 12,
    borderRadius: 21,
    width: 42,
    height: 42,
    backgroundColor: 'grey'
  },
  previewContainerWrapper: {
    flex: 1,
    height: 42,
    alignItems: 'flex-end',
  },
  preview: {
    alignSelf: 'center',
    fontSize: 15,
    color: 'white',
  },

  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    right: 20,
    bottom: 20,
  }
});