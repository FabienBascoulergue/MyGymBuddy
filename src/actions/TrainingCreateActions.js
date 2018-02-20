//import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import {
  TRAINING_NAME_CHANGED,
  EXERCISES_FETCH_SUCCESS,
  EXERCISE_NAME_CHANGED,
  EXERCISE_CREATE,
  TRAINING_CREATE,
  EXERCISE_NB_SETS_CHANGED,
  EXERCISE_NOTES_CHANGED
} from './types';

export const trainingNameChanged = (text) => {
  return {
    type: TRAINING_NAME_CHANGED,
    payload: text
  };
};

export const exerciseNameChanged = (text) => {
  return {
    type: EXERCISE_NAME_CHANGED,
    payload: text
  };
};

export const nbSetsChanged = (text) => {
  return {
    type: EXERCISE_NB_SETS_CHANGED,
    payload: text
  };
};

export const notesChanged = (text) => {
  return {
    type: EXERCISE_NOTES_CHANGED,
    payload: text
  };
};

export const exercisesFetch = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/exercises`)
      .on('value', snapshot => {
        dispatch({ type: EXERCISES_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const createExercise = ({ exerciseName }) => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/exercises`)
    .push({ exerciseName })
    .then(() => {
      dispatch({ type: EXERCISE_CREATE });
    });
  };
};

export const createTraining = ({ trainingName, exerciseSelectedData }) => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/trainings`)
    .push({ trainingName, exerciseSelectedData })
    .then(() => {
      dispatch({ type: TRAINING_CREATE });
    });
  };
};
