import {
  TRAINING_STARTED_DATA,
  TRAINING_STARTED_NAME,
  TRAINING_STARTED_ID,
  TRAINING_SELECT_EXERCISE
} from './types';

export const startTrainingData = (trainingSelectedData) => {
  return {
    type: TRAINING_STARTED_DATA,
    payload: trainingSelectedData
  };
};

export const startTrainingName = (pressedTrainingName) => {
  return {
    type: TRAINING_STARTED_NAME,
    payload: pressedTrainingName
  };
};

export const startTrainingId = (pressedTrainingId) => {
  return {
    type: TRAINING_STARTED_ID,
    payload: pressedTrainingId
  };
};

export const trainingSelectedExercise = (selectedExerciseId) => {
  return {
    type: TRAINING_SELECT_EXERCISE,
    payload: selectedExerciseId
  };
};
