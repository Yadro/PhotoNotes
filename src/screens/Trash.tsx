import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Vibration,
  Alert,
  ListView,
} from 'react-native';
import {connect} from "react-redux";
import {ScreenNavigationProp} from "react-navigation";
import Toolbar from '../components/Toolbar';
import List from "./List";
import icons from '../components/Icons'
import {Actions} from "../redux/Actions";
import l from './Localization';
import Note from "../redux/Note";
import store from "../redux/Store";
import {removeAnywayArr, removeAnyway} from "../constants/ActionTypes";
const {removeMulti} = l.Alert;
const {arrowWhite, deleteIconWhite} = icons;

interface TrashP extends ScreenNavigationProp  {
  notes;
  tag;
}
interface TrashS {
  selected;
  multi;
  dataSource;
  notes;
}
class Trash extends React.Component<TrashP, TrashS> {
  private ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

  constructor(props) {
    super(props);
    this.state = {
      notes: props.notes,
      dataSource: this.ds.cloneWithRows(props.notes),
      multi: false,
      selected: [],
    };
  }

  componentWillReceiveProps(newProps) {
    const {props} = this;
    const {notes, tag} = newProps;

    const checker = check(tag);
    const filteredNotes = notes.filter(n => checker(n.tags));

    if (filteredNotes.length == props.notes.length &&
      filteredNotes.every(note => Note.equalNeedUpdate(note, props.notes.find(e => e.id == note.id)))) {
      return;
    }

    this.setState({
      notes: filteredNotes,
      dataSource: this.ds.cloneWithRows(filteredNotes),
    });
  }

  disableMultiSelect = () => {
    this.setState({multi: false, selected: []})
  };

  removeItems(ids) {
    Alert.alert('Удалить навсегда', 'Удалить выбранные элементы навсегда?', [{
      text: removeMulti.buttons.cancel,
      onPress: () => this.disableMultiSelect()
    }, {
      text: removeMulti.buttons.remove,
      onPress: () => {
        Actions.removesAnyway(ids);
        this.disableMultiSelect();
      }
    }], {cancelable: true});
  }

  longPressHandler = (id) => {
    const {selected} = this.state;
    selected.push(id);
    this.setState({
      multi: true,
      selected
    });

    Vibration.vibrate([0, 40], false);
  };

  pressHandler = (id) => () => {
    const {navigate} = this.props.navigation;
    if (this.state.multi) {
      let {selected} = this.state;
      if (selected.includes(id)) {
        selected = selected.filter(e => e != id);
      } else {
        selected.push(id);
      }
      this.setState({selected});
    } else {
      navigate('NoteView', {id: id})
    }
  };

  onActionSelected = (action) => {
    if (this.state.multi) {
      if (action == null) {
        this.disableMultiSelect();
      } else if (action == 0) {
        this.removeItems(this.state.selected);
      }
    } else {
      if (action == null) {
        this.props.navigation.goBack();
      } else if (action == 0) {
        this.removeItems(this.state.notes.map(e => e.id));
      }
    }
  };

  render() {
    const {dataSource, selected} = this.state;
    return <View style={{flex: 1}}>
      <Toolbar title={'Корзина'}
               navIcon={arrowWhite}
               onActionSelected={this.onActionSelected}
               actions={[{title: 'Удалить', icon: deleteIconWhite, show: 'always'}]}
               color="white" backgroundColor="#01B47C"/>
      <List dataSource={dataSource} selected={selected}
            pressHandler={this.pressHandler} longPressHandler={this.longPressHandler}/>
    </View>
  }
}

export default connect(state => ({notes: state.notes, tag: 'trash'}))(Trash);

const check = (tag: string) => {
  let include;
  let query;
  if (tag.charAt(0) == '!') {
    include = false;
    query = tag.substr(1);
  } else {
    include = true;
    query = tag;
  }
  return (values: string[]) => {
    const res = values.indexOf(query);
    return include ? res > -1 : res == -1;
  };
};