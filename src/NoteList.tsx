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

export default class NoteList extends Component<any, any> {

  static navigationOptions = {
    title: 'Welcome',
    header: (e) => {
      return {
        right: <Button title={'New'} onPress={() => e.navigate('NoteView', {id: 0})}/>
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
    this.onLongPress = this.onLongPress.bind(this);
  }

  componentWillMount() {
    this.disp = store.subscribe((e) => {
      this.setState({
        dataSource: this.ds.cloneWithRows(store.getState().notes.notes)
      })
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <ListView
            enableEmptySections
            contentContainerStyle={css.container}
            dataSource={this.state.dataSource}
            renderRow={(rowData: Note) =>
              <TouchableNativeFeedback onPress={() => navigate('NoteEdit', {id: rowData.id})}>
                <View><Text style={css.item}>{rowData.title}</Text></View>
              </TouchableNativeFeedback>
            }
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
  item: {
    padding: 20,
    fontSize: 17,
    color: 'black',
  },
  text: {
    backgroundColor: "transparent",
    color: "#FFF",
  },
  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    right: 20,
    bottom: 20,
  }
});