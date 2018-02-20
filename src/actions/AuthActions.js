import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  CREATEEMAIL_CHANGED,
  CREATEPASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  CREATE_USER,
  CREATE_USER_FAILED
} from './types';

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const createEmailChanged = (text) => {
  return {
    type: CREATEEMAIL_CHANGED,
    payload: text
  };
};

export const createPasswordChanged = (text) => {
  return {
    type: CREATEPASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch(() => loginUserFail(dispatch));
  };
};

export const createUser = ({ createemail, createpassword }) => {
  let userRef = '';
  return (dispatch) => {
    dispatch({ type: CREATE_USER });

    firebase.auth().createUserWithEmailAndPassword(createemail, createpassword)
      .then(user => {
        loginUserSuccess(dispatch, user);
        console.log(user);

        user.uid !== null ?
        (userRef = firebase.database().ref(`/users/${user.uid}/exercises`),
        userRef.push({ exerciseName: 'Bench Press' }),
        userRef.push({ exerciseName: 'Squat' }),
        userRef.push({ exerciseName: 'Deadlift' })) :
        null;
      })
      .catch((error) => { 
        console.log(error); 
        dispatch({ type: CREATE_USER_FAILED, payload: error }); 
      });
  };
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({
  type: LOGIN_USER_SUCCESS,
  payload: user
  });

  Actions.main();
};
