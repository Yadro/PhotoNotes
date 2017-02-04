import store from './Store';

export const Actions = {
  add(note) {
    return store.dispatch({type: 'ADD', note});
  },

  update(note) {
    return store.dispatch({type: 'UPDATE', note});
  },

  showItem(id) {
    return store.dispatch({type: 'show-view.item', currentId: id});
  },

  show(screen: 'list' | 'item') {
    return store.dispatch({type: 'show-view.' + screen});
  },
};


export const ActionOther = {
  setViewSize(size) {
    store.dispatch({type: 'SET_VIEW_SIZE', size});
  }
};