import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import store from "./redux/Store";
import {Actions} from "./redux/Actions";
import Note from "./Note";

export default class NoteList extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(store.getState().notes.notes),
    };
    this.onLongPress = this.onLongPress.bind(this);
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
      <ScrollView>
        <ListView
          contentContainerStyle={css.container}
          dataSource={this.state.dataSource}
          renderRow={(rowData: Note) =>
            <TouchableNativeFeedback onPress={() => navigate('NoteEdit', {id: rowData.id})}>
              <View>
                <Text style={css.item}>{rowData.title + rowData.id}</Text>
              </View>
            </TouchableNativeFeedback>
          }
        />
      </ScrollView>
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
  }
});