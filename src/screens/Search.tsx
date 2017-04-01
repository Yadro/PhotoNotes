import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  ListView,
  TouchableNativeFeedback,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Toolbar from "../components/Toolbar";
import icons from '../components/Icons'
import store from "../redux/Store";
import {ScreenNavigationProp} from "react-navigation";
import l from '../constants/Localization';
import PreviewCircle from '../components/PreviewCircle';
import {tracker} from "../Analytics";
import Note from "../redux/Note";
import {connect} from "react-redux";
const {toolbar, window} = l.Search;
const {arrowWhite, searchBlack} = icons;

interface SearchP extends ScreenNavigationProp {
  notes: Note[];
}
interface SearchS {
  dataSource;
  search;
}
class Search extends React.Component<SearchP, SearchS> {
  private searchDelay;
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

  constructor(props: SearchP) {
    super(props);
    this.state = {
      dataSource: this.ds.cloneWithRows(props.notes),
      search: '',
    };
    if (!__DEV__) tracker.trackScreenView('Search');
  }

  componentWillReceiveProps(newProps) {
    // todo need update ?
    this.setState({
      dataSource: this.ds.cloneWithRows(newProps),
    });
  }

  pressIcon = () => {
    this.props.navigation.goBack();
  };

  pressHandler = (id) => () => {
    this.props.navigation.navigate('NoteView', {id: id})
  };

  onChange = (search) => {
    const searchLower = search.toLowerCase();
    const filtered = this.props.notes.filter((e) => e.title.toLowerCase().indexOf(searchLower) >= 0);
    this.setState({search});

    clearTimeout(this.searchDelay);
    this.searchDelay = setTimeout(() => {
      this.setState({
        dataSource: this.ds.cloneWithRows(filtered)
      });
    }, 500);
  };

  renderRow = (rowData) => {
    const {id, image, title, images} = rowData;
    const thumbnail = images && images.thumbnail && images.thumbnail['50'] || image;
    return (
      <TouchableNativeFeedback onPress={this.pressHandler(id)}>
        <View style={css.item}>
          <View style={css.imagePrevWrapper}>
            {!!thumbnail ?
              <Image source={{uri: thumbnail}} style={css.imagePrev}/> :
              <PreviewCircle text={title}/>}
          </View>
          <Text style={css.text}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  };

  render() {
    return <View style={css.container}>
      <Toolbar
        title={toolbar.header}
        navIcon={arrowWhite}
        color="white"
        backgroundColor="#01B47C"
        onIconClicked={this.pressIcon}
      />
      <View style={css.bar} elevation={5}>
        <View style={css.searchBox} elevation={2}>
          <Image source={searchBlack}/>
          <TextInput
            style={css.search}
            placeholder={window.search}
            underlineColorAndroid="transparent"
            onChangeText={this.onChange}
            value={this.state.search}
            autoFocus
          />
        </View>
      </View>
      <ListView enableEmptySections dataSource={this.state.dataSource} renderRow={this.renderRow}/>
    </View>
  }
}
export default connect(state => {
  return {
    notes: state.notes
  };
})(Search);

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bar: {
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

  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dedede'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
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
});