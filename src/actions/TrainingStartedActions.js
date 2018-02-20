import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import {
  TRAINING_DATA_SAVED,
  LEVEL_UPDATED,
  EXPERIENCE_CURRENT_UPDATED,
  EXPERIENCE_TOTAL_UPDATED
} from './types';

export const trainingDataSave = (
  trainingData, 
  trainingName, 
  trainingId, 
  weight, 
  experienceCurrent, 
  experienceTotal,
  level
) => {
  console.log('inside trainingDataSave');
  console.log(trainingData);
  const { currentUser } = firebase.auth();
  const bodyWeight = parseFloat(weight.replace(',', '.')) || 70;
  const today = (new Date()).toJSON();
  const trainingDataFormatted = [];
  let exerciseIndex = 0;
  let rest = 0;
  let nbRep = 0;
  let intensity = 0;
  let duration = 0;
  let setScore = 0;
  let exerciseScore = 0;
  let trainingScore = 0;
  let exerciseName = '';
  let exerciseId = '';
  let set = [];
  console.log('exerciseScore/before forEach');
  console.log(exerciseScore);

  trainingData.forEach((data) => {
    

    exerciseIndex === data.exerciseIndex ?
    ( //every set of each exercise
      exerciseName = data.exerciseName,
      exerciseId = data.exerciseID,
      rest = parseFloat(data.rest.replace(',', '.')) || 90,
      nbRep = parseFloat(data.nbRep.replace(',', '.')) || 0,
      intensity = parseFloat(data.intensity.replace(',', '.')) || 0,
      duration = parseFloat(data.duration.replace(',', '.')) || 30,
      setScore = (1 + (duration / rest)) * ((2 * intensity) / (bodyWeight + 70)) * nbRep * 25,
      exerciseScore = exerciseScore + setScore,
      set[data.setIndex - 1] = {
        key: data.key,
        rest,
        nbRep,
        intensity,
        duration,
        setScore
      }
    ) :
    (
      //push every new exercise then start new set for new exercise
      trainingDataFormatted.push({ 
        exerciseName,
        exerciseId,
        exerciseScore,
        set
      }),
      exerciseName = data.exerciseName,
      exerciseId = data.exerciseID,
      exerciseIndex = data.exerciseIndex,
      trainingScore = trainingScore + exerciseScore,
      exerciseScore = 0,
      set = [],
      rest = parseFloat(data.rest.replace(',', '.')) || 90,
      nbRep = parseFloat(data.nbRep.replace(',', '.')) || 0,
      intensity = parseFloat(data.intensity.replace(',', '.')) || 0,
      duration = parseFloat(data.duration.replace(',', '.')) || 30,
      setScore = (1 + (duration / rest)) * ((2 * intensity) / (bodyWeight + 70)) * nbRep * 25,
      exerciseScore = exerciseScore + setScore,
      set[data.setIndex - 1] = {
        key: data.key,
        rest,
        nbRep,
        intensity,
        duration,
        setScore
      }
    );
  });

  // push for the last exercise
  trainingScore = Math.round(trainingScore + exerciseScore);

  trainingDataFormatted.push({ 
    exerciseName,
    exerciseId,
    exerciseScore,
    set
  });

  // push details of the training
  trainingDataFormatted.push({
    date: today,
    trainingName,
    trainingId,
    bodyWeight,
    trainingScore
  });

  // Calcul new level and experience
  const newExperienceTotal = experienceTotal + trainingScore;
  let newExperienceCurrent = experienceCurrent + trainingScore;
  const newLevel = level + (trainingScore / ((3000 * Math.trunc(level)) + 7000));

  console.log('level, expCurrent, expTot');
  console.log(newLevel, newExperienceCurrent, newExperienceTotal);

  Math.trunc(newLevel) > Math.trunc(level) ?
  newExperienceCurrent = 
    Math.round(
      (newLevel - Math.trunc(newLevel)) * ((3000 * Math.trunc(newLevel)) + 7000)
    ) :
  null;
  const profileRef = firebase.database().ref(`/users/${currentUser.uid}/profile`);

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/trainingSessions`)
      .push(trainingDataFormatted)
      .then(() => {
        dispatch({ type: TRAINING_DATA_SAVED, payload: trainingDataFormatted });
      })
      .then(() => setTimeout(() => {
        Alert.alert('Saved', `You earned ${trainingScore} experience points with your training !`);
      }, 200));
    profileRef.child('level').set(newLevel);
    profileRef.child('experienceCurrent').set(newExperienceCurrent);
    profileRef.child('experienceTotal').set(newExperienceTotal);

    dispatch({ type: LEVEL_UPDATED, payload: newLevel });
    dispatch({ type: EXPERIENCE_CURRENT_UPDATED, payload: newExperienceCurrent });
    dispatch({ type: EXPERIENCE_TOTAL_UPDATED, payload: newExperienceTotal });
    Actions.main();
  }; 
};
