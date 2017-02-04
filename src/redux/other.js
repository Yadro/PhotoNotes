

export default (state = {update: false, size: null, }, actions) => {
  let newState;
  switch (actions.type) {
    case 'SET_VIEW_SIZE':
      return Object.assign({}, state, {size: actions.size});
  }
  return state;
};