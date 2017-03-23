import * as React from 'react';
import {View, Text, Image, TouchableNativeFeedback, StyleSheet} from 'react-native';
import icons from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";
import {connect} from "react-redux";
import {FilterState} from "../redux/filter";
const {editWhite} = icons;

interface TagsLayerP extends ScreenNavigationProp {
  filter: FilterState;
}
interface TagsLayerS {
}


class FilterTags extends React.Component<TagsLayerP, TagsLayerS> {

  onPress = (id) => {
    this.props.navigation.navigate('EditFilter', {id});
  };

  onLongPress = id => () => {
    this.props.navigation.navigate('EditFilter', {id});
  };

  render() {
    const {filters} = this.props.filter;
    return <View style={{flex: 1}}>
      {filters.map((e, idx) => <Item key={idx} title={e.title} onPress={this.onPress.bind(this, idx)}
                                   onLongPress={this.onLongPress(idx)}/>)}
      <Item title={'Add new filter'} onPress={this.onPress.bind(this, -1)} onLongPress={this.onLongPress(-1)}/>
    </View>
  }
}

export default connect(state => ({filter: state.filter}))(FilterTags);

const Item = ({title, onPress, onLongPress}) => {
  return <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress} style={css.container}>
    <View style={css.item}>
      {/*<Image source={{uri: editWhite}}/>*/}
      <Text>{title}</Text>
    </View>
  </TouchableNativeFeedback>
};


const css = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  }
});