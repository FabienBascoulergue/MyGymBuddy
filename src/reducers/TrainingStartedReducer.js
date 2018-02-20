import {
  TRAINING_DATA_SAVED
} from '../actions/types';

const INITIAL_STATE = {
  trainingDataSaved: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRAINING_DATA_SAVED:
      return { ...state, trainingDataSaved: action.payload };
    default:
    return state;
  }
};
