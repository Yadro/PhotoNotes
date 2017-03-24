import * as React from 'react';
import {View} from 'react-native';
import Toolbar from "../components/Toolbar";
import CheckboxList from "../components/CheckboxList";
import {connect} from "react-redux";
import {FilterState} from "../redux/filter";
import icons from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";

interface NoteTagsP extends ScreenNavigationProp {
  tags;
  filter: FilterState;
}
interface NoteTagsS {
  data;
}

class NoteTags extends React.Component<NoteTagsP, NoteTagsS> {

  constructor(props) {
    super(props);
    console.log(props);
    const propsTags = props.navigation.state.params.tags;
    const tags = Array.from(
      props.filter.filters.reduce((res, item) => {
        item.tags.forEach(e => res.add(e));
        return res;
      }, new Set())
    ).map(title => ({
      title,
      value: propsTags && propsTags.indexOf(title) > -1 || false,
    }));

    this.state = {
      data: tags,
    };
  }

  onChange = (data) => {
    this.setState({data})
  };

  onAddItem = (data) => {
    this.setState({data})
  };

  onActionSelected = () => {

    this.props.navigation.goBack();
  };

  render() {
    return <View style={{flex: 1}}>
      <Toolbar title="Tags" navIcon={icons.arrowWhite} onActionSelected={this.onActionSelected}/>
      <CheckboxList data={this.state.data} onChange={this.onChange} onAddItem={this.onAddItem}/>
    </View>
  }
}

export default connect(state => ({filter: state.filter}))(NoteTags);