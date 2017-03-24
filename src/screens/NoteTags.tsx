import * as React from 'react';
import {View} from 'react-native';
import Toolbar from "../components/Toolbar";
import CheckboxList from "../components/CheckboxList";
import {connect} from "react-redux";
import {FilterState} from "../reducers/filter";
import icons from '../components/Icons';
import {ScreenNavigationProp} from "react-navigation";
import store from "../redux/Store";
import {SET_TAGS} from "../constants/ActionTypes";
import {green} from "../constants/theme";

interface NoteTagsP extends ScreenNavigationProp {
  id;
  tags;
  filter: FilterState;
}
interface NoteTagsS {
  data;
}

class NoteTags extends React.Component<NoteTagsP, NoteTagsS> {

  constructor(props) {
    super(props);
    const {note} = props.navigation.state.params;
    const tags = Array.from(
      props.filter.filters.reduce((res, item) => {
        item.tags.forEach(e => res.add(e));
        return res;
      }, new Set())
    ).map(title => ({
      title,
      value: note.tags.indexOf(title) > -1 || false,
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
    const {note} = this.props.navigation.state.params;
    const {data} = this.state;
    note.tags = data.filter(e => e.value).map(e => e.title);
    this.props.navigation.goBack();
  };

  render() {
    return <View style={{flex: 1}}>
      <Toolbar title="Tags" color='white' backgroundColor={green}
               navIcon={icons.arrowWhite} onActionSelected={this.onActionSelected}/>
      <CheckboxList data={this.state.data} style={{backgroundColor: 'white'}}
                    onChange={this.onChange} onAddItem={this.onAddItem}/>
    </View>
  }
}

export default connect(state => ({filter: state.filter}))(NoteTags);