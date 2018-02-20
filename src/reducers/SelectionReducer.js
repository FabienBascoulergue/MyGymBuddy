import {
  TRAINING_SELECT_EXERCISE
} from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case TRAINING_SELECT_EXERCISE:
      return action.payload;
    default:
    return state;
  }
};
