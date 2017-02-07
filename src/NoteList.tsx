import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  Button,
  TouchableNativeFeedback,
  Vibration,
  ToolbarAndroid
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

const toolbarActions = [
  {title: 'Delete', icon: nativeImageSource({
    android: 'ic_delete_black_24dp',
    width: 24,
    height: 24
  }), show: 'always'},
];

export default class NoteList extends Component<any, any> {

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
      selected: []
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

  onLongPress() {
    const options = {
      options: ['Delete', 'Save', 'Cancel'],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 0,
    };
    this.props.showActionSheetWithOptions(options, () => {});
  }

  disableMultiSelect = () => {
    this.setState({multi: false, selected: []})
  }

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

    Vibration.vibrate();
    window.setTimeout(() => {
      Vibration.cancel();
    }, 50);
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
      navigate('NoteEdit', {id: id})
    }
  }

  renderRow = (rowData: Note) => {
    const {id} = rowData;
    const {selected, multi} = this.state;
    const isSelected = selected.includes(id);
    return (
      <TouchableNativeFeedback onPress={this.pressHandler(multi, id)}
                               onLongPress={this.longPressHandler.bind(null, rowData.id)}
                               delayLongPress={delay}>
        <View style={isSelected ? css.selectedItem : null}>
          <Text style={css.text}>{rowData.title}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  onActionSelected = (action) => {
    if (action == null) {
      this.disableMultiSelect();
    } else if (action == 0) {
      this.removeItems(this.state.selected);
    }
  };

  renderToolBar = () => {
    if (this.state.multi) {
      return (
        <ToolbarAndroid
          elevation={5}
          actions={toolbarActions}
          style={css.toolbar}
          title="Select to remove"
          onIconClicked={this.onActionSelected}
          onActionSelected={this.onActionSelected}
          navIcon={nativeImageSource({
              android: 'ic_close_black_24dp',
              width: 24,
              height: 24
            })}
        />
      )
    } else {
      return (
        <ToolbarAndroid
          elevation={5}
          style={css.toolbar}
          title="Toolbar"
        />
      )
    }
  };

  render() {
    const {multi} = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={{flex: 1}}>
        {this.renderToolBar()}
        <ScrollView>
          <ListView enableEmptySections
            contentContainerStyle={css.container}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
          />
        </ScrollView>
        <FloatingActionButton ref="fab" style={css.button} onPress={() => navigate('NoteCreate')}/>
      </View>
    );
  }
}


const css = StyleSheet.create({
  toolbar: {
    backgroundColor: '#fff',
    height: 56,
  },
  container: {
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
  selectedItem: {
    backgroundColor: '#ddd',
  },
  item: {

  },
  text: {
    padding: 20,
    fontSize: 17,
    color: 'black',
  },

  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    right: 20,
    bottom: 20,
  }
});