import firebase from 'firebase';
import { Alert } from 'react-native';
import {
  HEIGHT_CHANGED,
  WEIGHT_CHANGED,
  DESCRIPTION_CHANGED,
  PROFILE_NAME_CHANGED,
  PICTURE_CHANGED,
  PROFILE_CHANGES_SAVED,
  PROFILE_FETCH_SUCCESS,
  LEVEL_UPDATED,
  EXPERIENCE_CURRENT_UPDATED,
  EXPERIENCE_TOTAL_UPDATED,
  OBJECTIVES_FETCH,
  OBJECTIVE_ADD,
  FILTERED_ACCOMPLISHED_OBJECTIVES,
  FILTERED_CURRENT_OBJECTIVES,
  CURRENT_OBJECTIVE_REMOVE,
  CURRENT_OBJECTIVE_UPDATE,
  OBJECTIVE_ACCOMPLISHMENT
} from './types';


export const heightChanged = (text) => {
  return {
    type: HEIGHT_CHANGED,
    payload: text
  };
};

export const weightChanged = (text) => {
  return {
    type: WEIGHT_CHANGED,
    payload: text
  };
};

export const profileNameChanged = (text) => {
  return {
    type: PROFILE_NAME_CHANGED,
    payload: text
  };
};

export const descriptionChanged = (text) => {
  return {
    type: DESCRIPTION_CHANGED,
    payload: text
  };
};

export const profilePictureChanged = (text) => {
  return {
    type: PICTURE_CHANGED,
    payload: text
  };
};

export const saveProfileChanges = ({ profileName, height, weight, description, pictureUri }) => {
  const { currentUser } = firebase.auth();
  const profileRef = firebase.database().ref(`/users/${currentUser.uid}/profile`);

  return (dispatch) => {
    profileRef.child('profileName').set(profileName);
    profileRef.child('height').set(height);
    profileRef.child('weight').set(weight);
    profileRef.child('description').set(description);
    profileRef.child('pictureUri').set(pictureUri)
    .then(() => {
      dispatch({ type: PROFILE_CHANGES_SAVED });
    })
    .then(() => Alert.alert('Saved', 'Your changes have been saved succesfully'));
  };
};

export const profileFetch = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/profile`)
      .once('value', snapshot => {
        console.log(currentUser.uid);
        console.log(snapshot.val());

        snapshot.exists() ?
        (
          snapshot.child('profileName').exists() ?
          dispatch({ type: PROFILE_NAME_CHANGED, payload: snapshot.val().profileName }) : null,
          snapshot.child('height').exists() ?
          dispatch({ type: HEIGHT_CHANGED, payload: snapshot.val().height }) : null,
          snapshot.child('weight').exists() ?
          dispatch({ type: WEIGHT_CHANGED, payload: snapshot.val().weight }) : null,
          snapshot.child('description').exists() ?
          dispatch({ type: DESCRIPTION_CHANGED, payload: snapshot.val().description }) : null,
          snapshot.child('pictureUri').exists() ?
          dispatch({ type: PICTURE_CHANGED, payload: snapshot.val().pictureUri }) : null,
          snapshot.child('level').exists() ?
          dispatch({ type: LEVEL_UPDATED, payload: snapshot.val().level }) : null,
          snapshot.child('experienceCurrent').exists() ?
          dispatch({ type: EXPERIENCE_CURRENT_UPDATED, payload: snapshot.val().experienceCurrent }) : null,
          snapshot.child('experienceTotal').exists() ?
          dispatch({ type: EXPERIENCE_TOTAL_UPDATED, payload: snapshot.val().experienceTotal }) : null,
          snapshot.child('objectives').exists() ?
          dispatch({ type: OBJECTIVES_FETCH, payload: snapshot.val().objectives }) : null,
          dispatch({ type: PROFILE_FETCH_SUCCESS })
        ) :
        dispatch({ type: PROFILE_FETCH_SUCCESS });
      });
  };
};

export const filterObjectives = (objectives) => {
  const currentObjectives = [];
  const accomplishedObjectives = [];

  return (dispatch) => {
    console.log(objectives);
    objectives !== {} ?
    (Object.keys(objectives).forEach((key) => {
      objectives[key].uid = key;
      objectives[key].accomplished === true ?
      accomplishedObjectives.push(objectives[key]) :
      currentObjectives.push(objectives[key]);
    }),
    console.log('accomplishedObjectives, currentObjectives'),
    console.log(accomplishedObjectives),
    console.log(currentObjectives)) :
    console.log('NULL');


    dispatch({ type: FILTERED_ACCOMPLISHED_OBJECTIVES, payload: accomplishedObjectives });
    dispatch({ type: FILTERED_CURRENT_OBJECTIVES, payload: currentObjectives });
  };
};

export const addNewObjective = (objectiveName, objectiveValue) => {
  const { currentUser } = firebase.auth();
  const newObjective = { accomplished: false, objectiveName, objectiveValue, valueHistory: [] };
  const firebaseRef = firebase.database().ref(`/users/${currentUser.uid}/profile/objectives`);
  let pushRef = '';
  return (dispatch) => {
    pushRef = firebaseRef.push(); 
    pushRef.set(newObjective)
      .then(
        newObjective.uid = pushRef.key,
        dispatch({ type: OBJECTIVE_ADD, payload: newObjective }));
  };
};

export const deleteCurrentObjective = (objectiveUid) => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/profile/objectives/${objectiveUid}`)
      .remove()
      .then(dispatch({ type: CURRENT_OBJECTIVE_REMOVE, payload: objectiveUid }));
  };
};

export const editCurrentObjective = (updatedValue, objectiveUid, currentObjectives) => {
  const { currentUser } = firebase.auth();
  const today = (new Date()).toJSON();
  const updatedObjectives = currentObjectives;
  const objectiveRef = firebase.database().ref(`/users/${currentUser.uid}/profile/objectives/${objectiveUid}`);
  const objIndex = updatedObjectives.findIndex(obj => obj.uid === objectiveUid);

  updatedObjectives[objIndex].lastUpdate = today;
  updatedObjectives[objIndex].currentValue = updatedValue;

  return (dispatch) => {
    objectiveRef.child('valueHistory').push({ 
      date: updatedObjectives[objIndex].lastUpdate,
      datedValue: updatedObjectives[objIndex].currentValue
    });
    objectiveRef.child('currentValue').set(updatedValue);
    objectiveRef.child('lastUpdate').set(today);
    dispatch({ type: CURRENT_OBJECTIVE_UPDATE, payload: updatedObjectives });
  };
};

export const accomplishObjective = (objectiveUid, currentObjectives, accomplishedObjectives) => {
  const { currentUser } = firebase.auth();
  const objIndex = currentObjectives.findIndex(obj => obj.uid === objectiveUid);
  const today = (new Date()).toJSON();

  const accomplishedObjective = currentObjectives[objIndex];
  accomplishedObjective.accomplished = true;
  accomplishedObjective.accomplishedDate = today;
  const updatedAccomplished = accomplishedObjectives;
  updatedAccomplished.push(accomplishedObjective);
  const updatedCurrent = currentObjectives.filter(obj => obj.uid !== objectiveUid);
  
  console.log('accomplishObjective/ current - accomplished');
  console.log(updatedCurrent);
  console.log(updatedAccomplished);

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/profile/objectives/${objectiveUid}`)
    .child('accomplished').set(true);
    firebase.database().ref(`/users/${currentUser.uid}/profile/objectives/${objectiveUid}`)
    .child('accomplishedDate').set(today);

    dispatch({ type: OBJECTIVE_ACCOMPLISHMENT, payload: { updatedCurrent, updatedAccomplished } });
  };
};
