import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import store, {NotesAction} from "./NoteStore";
import Note from "./Note";

export default class NoteList extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(store.getState().notes),
    };
  }

  render() {
    return (
      <ScrollView>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData: Note) =>
            <TouchableNativeFeedback onPress={() => NotesAction.showItem(rowData.id)}>
              <View>
                <Text style={css.item}>{rowData.title + rowData.id}</Text>
              </View>
            </TouchableNativeFeedback>
          }
          contentContainerStyle={css.container}
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