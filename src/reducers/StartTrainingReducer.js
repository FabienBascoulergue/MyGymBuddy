import {
  TRAINING_STARTED_DATA,
  TRAINING_STARTED_NAME,
  TRAINING_STARTED_ID
} from '../actions/types';

const INITIAL_STATE = {
  trainingData: [],
  trainingName: '',
  trainingId: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRAINING_STARTED_DATA:
      return { ...state, trainingData: action.payload };
    case TRAINING_STARTED_NAME:
      return { ...state, trainingName: action.payload };
    case TRAINING_STARTED_ID:
      return { ...state, trainingId: action.payload };
    default:
      return state;
}
};
