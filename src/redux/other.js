

export default (state = {update: false, size: null, }, actions) => {
  let newState;
  if (['ADD', 'UPDATE', 'IMPORT'].includes(actions.type)) {
    return Object.assign({}, state, {update: true});
  }
  switch (actions.type) {
    case 'SET_VIEW_SIZE':
      return Object.assign({}, state, {size: actions.size});
  }
  return state;
};