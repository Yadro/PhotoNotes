import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Toolbar from "./Toolbar";
import icons from './Icons'
const {arrowWhite, searchBlack} = icons;

interface SearchP {
}
interface SearchS {
}
export default class Search extends React.Component<SearchP, SearchS> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <View style={css.container}>
      <Toolbar title="Note filter" navIcon={arrowWhite} color="white" backgroundColor="#01B47C" />
      <View style={css.bar} elevation={5}>
        <View style={css.searchBox} elevation={2}>
          <Image source={searchBlack} />
          <TextInput style={css.search} placeholder="Search" underlineColorAndroid="transparent"/>
        </View>
      </View>
    </View>
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bar: {
    // height: 40,
    backgroundColor: '#01B47C',
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 8,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 2,
    backgroundColor: 'white',
  } as ViewStyle,
  search: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 10,
    padding: 0,
    fontSize: 16,
  } as TextStyle,
});