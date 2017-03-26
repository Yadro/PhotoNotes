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
import {REMOVE_ANYWAY_ARR, REMOVE_ANYWAY} from "../constants/ActionTypes";
import {check} from "../util/tagUtil";
import {tracker} from "../Analytics";
const {removeMulti} = l.Alert;
const {arrowWhite, closeWhite, deleteIconWhite} = icons;

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
  check;

  constructor(props) {
    super(props);
    const {tag, notes} = props;
    this.check = check(tag);
    this.state = {
      notes: props.notes,
      dataSource: this.ds.cloneWithRows(notes.filter(n => this.check(n.tags))),
      multi: false,
      selected: [],
    };
    if (!__DEV__) tracker.trackScreenView('Trash');
  }

  componentWillReceiveProps(newProps) {
    const {props} = this;
    const {notes} = newProps;
    const filteredNotes = notes.filter(n => this.check(n.tags));

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
      navigate('NoteView', {id: id, type: 'trash'});
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
    const {dataSource, selected, multi} = this.state;
    return <View style={{flex: 1}}>
      <Toolbar title={multi ? 'Выбрать' : 'Корзина'}
               navIcon={multi ? closeWhite : arrowWhite}
               onActionSelected={this.onActionSelected}
               actions={[{title: 'Удалить', icon: deleteIconWhite, show: 'always'}]}
               color="white" backgroundColor="#01B47C"/>
      <List dataSource={dataSource} selected={selected}
            pressHandler={this.pressHandler} longPressHandler={this.longPressHandler}/>
    </View>
  }
}

export default connect(state => ({notes: state.notes, tag: 'trash'}))(Trash);