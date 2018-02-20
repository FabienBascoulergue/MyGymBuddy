import {
  TRAINING_NAME_CHANGED,
  EXERCISE_NAME_CHANGED,
  EXERCISE_CREATE,
  TRAINING_CREATE,
  EXERCISE_NB_SETS_CHANGED,
  EXERCISE_NOTES_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
  trainingName: '',
  exerciseName: '',
  nbSets: '',
  notes: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRAINING_NAME_CHANGED:
      return { ...state, trainingName: action.payload };
    case EXERCISE_NAME_CHANGED:
      return { ...state, exerciseName: action.payload };
    case EXERCISE_CREATE:
      return { ...state, exerciseName: '' };
    case TRAINING_CREATE:
      return { ...state, trainingName: '' };
    case EXERCISE_NB_SETS_CHANGED:
      return { ...state, nbSets: action.payload };
    case EXERCISE_NOTES_CHANGED:
      return { ...state, notes: action.payload };
    default:
      return state;
  }
};
