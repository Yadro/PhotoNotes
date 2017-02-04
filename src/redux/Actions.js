import store from './Store';

export default Actions = {
  add(note) {
    return store.dispatch({type: 'add', note});
  },

  update(note) {
    return store.dispatch({type: 'update', note});
  },

  showItem(id) {
    return store.dispatch({type: 'show-view.item', currentId: id});
  },

  show(screen: 'list' | 'item') {
    return store.dispatch({type: 'show-view.' + screen});
  },
};