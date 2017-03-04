export type OtherState = {
  update: boolean;
  size;
  multi: boolean;
}

export default (state = {
  update: false, size: null, multi: false
}, actions) => {
  let newState;
  switch (actions.type) {
    case 'SET_VIEW_SIZE':
      return Object.assign({}, state, {size: actions.size});
    case 'SET_MULTI_CHOOSE':
      return Object.assign({}, state, {multi: actions.multi});
  }
  return state;
};