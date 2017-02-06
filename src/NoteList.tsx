import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  Button,
  TouchableNativeFeedback,
} from 'react-native';
import {
  FloatingActionButton,
  NestedScrollView,
  CoordinatorLayout,
  BottomSheetBehavior,
} from 'react-native-bottom-sheet-behavior';
import store from "./redux/Store";
import Note from "./Note";
import {ActionOther} from "./redux/Actions";

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
      dataSource: this.ds.cloneWithRows(store.getState().notes.notes),
    };
    this.longPressHandler = this.longPressHandler.bind(this);
  }

  componentWillMount() {
    this.disp = store.subscribe((e) => {
      const {notes, other} = store.getState();
      this.setState({
        dataSource: this.ds.cloneWithRows(notes.notes),
        multi: false,
        selected: []
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

  longPressHandler = (id) => {
    const {selected} = this.state;
    selected.push(id);
    this.setState({
      multi: true,
      selected
    });
  }

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
    console.log(isSelected);
    return (
      <TouchableNativeFeedback onPress={this.pressHandler(multi, id)}
                               onLongPress={this.longPressHandler.bind(null, rowData.id)}
                               delayLongPress={3000}>
        <View style={isSelected ? css.selectedItem : null}>
          <Text style={css.text}>{rowData.title}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render() {
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
        <FloatingActionButton ref="fab" style={css.button} onPress={() => navigate('NoteCreate')}/>
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
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