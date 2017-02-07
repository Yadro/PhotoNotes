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

const delay = __DEV__ ? 3000 : 1000;

export default class NoteList extends Component<any, any> {

  static navigationOptions = {
    title: 'Welcome',
    header: (e) => {
      const multi = store.getState().other.multi;
      if (multi) {
        return {
          left: <Button title={'Cancel'} onPress={() => e.navigate('NoteView', {id: 0})}/>,
          right: <Button title={'Remove'} onPress={() => e.navigate('NoteView', {id: 0})}/>
        }
      }
    },
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

    Vibration.vibrate([0, 90], false);
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

  renderTools = () => {
    return (
      <View style={css.toolBox}>
        <Button title="cancel" onPress={() => this.disableMultiSelect()}/>
        <Button title="delete" onPress={() => this.removeItems(this.state.selected)}/>
      </View>
    )
  }

  render() {
    const {multi} = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={{flex: 1}}>

        <ScrollView>
          <ListView enableEmptySections
            contentContainerStyle={css.container}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
          />
        </ScrollView>
        {multi
          ? this.renderTools()
          : <FloatingActionButton ref="fab" style={css.button} onPress={() => navigate('NoteCreate')}/>
        }
      </View>
    );
  }
}

const css = StyleSheet.create({
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