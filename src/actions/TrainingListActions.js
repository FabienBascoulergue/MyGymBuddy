import firebase from 'firebase';
import {
  TRAININGS_FETCH_SUCCESS
} from './types';

export const trainingsFetch = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/trainings`)
      .on('value', snapshot => {
        dispatch({ type: TRAININGS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};
