import firebase from 'firebase';
import {
  STATISTICS_SELECTED,
  FETCH_MAX1REP,
  FETCH_OBJECTIVES_ACCOMPLISHED,
  FETCH_TRAINING_HISTORY_DATA
} from './types';

export const statisticsSelected = (text) => {
  return {
    type: STATISTICS_SELECTED,
    payload: text
  };
};

export const fetchMax1Rep = () => {
  const { currentUser } = firebase.auth();
  let maxBench = 0;
  let maxSquat = 0;
  let maxDeadlift = 0;
  const dataHistory = [];
  let index = 0;

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/statistics/max1Rep`)
    .once('value', snapshot => {
      console.log('snapshot.val()');
      console.log(snapshot.val());
      snapshot.exists() ?
      (
        snapshot.child('maxBench').exists() ?
        maxBench = snapshot.child('maxBench').val() : null,

        snapshot.child('maxSquat').exists() ?
        maxSquat = snapshot.child('maxSquat').val() : null,

        snapshot.child('maxDeadlift').exists() ?
        maxDeadlift = snapshot.child('maxDeadlift').val() : null,

        snapshot.child('valueHistory').forEach(snapChild => {
          dataHistory[index] = 
          {
            date: snapChild.val().date.substr(0, 16),
            maxBench: snapChild.val().maxBench,
            maxSquat: snapChild.val().maxSquat,
            maxDeadlift: snapChild.val().maxDeadlift
          };
          index = index + 1;
        })
      ) :
      dataHistory[index] = 
        {
          date: new Date().toJSON().substr(0, 16),
          maxBench,
          maxSquat,
          maxDeadlift
        };
      console.log('{ maxBench, maxSquat, maxDeadlift, dataHistory }');
      console.log({ maxBench, maxSquat, maxDeadlift, dataHistory });
      dispatch({ type: FETCH_MAX1REP, payload: { maxBench, maxSquat, maxDeadlift, dataHistory } });
    });
  };
};

export const updateMax = (maxBench, maxSquat, maxDeadlift, dataHistory) => {
  const { currentUser } = firebase.auth();
  const today = new Date().toJSON();
  const firebaseRef = firebase.database().ref(`/users/${currentUser.uid}/statistics/max1Rep`);
  
  return (dispatch) => {
    firebaseRef.child('valueHistory').push({ date: today, maxBench, maxSquat, maxDeadlift });
    firebaseRef.child('maxBench').set(maxBench);
    firebaseRef.child('maxSquat').set(maxSquat);
    firebaseRef.child('maxDeadlift').set(maxDeadlift);
    dataHistory.push(
      {
        date: today.substr(0, 16),
        maxBench, 
        maxSquat, 
        maxDeadlift
      }
    );
    console.log('{ maxBench, maxSquat, maxDeadlift }');
    console.log({ maxBench, maxSquat, maxDeadlift, dataHistory });
    dispatch({ type: FETCH_MAX1REP, payload: { maxBench, maxSquat, maxDeadlift, dataHistory } });
  };
};

export const fetchObjectivesAccomplished = () => {
  const { currentUser } = firebase.auth();
  const objAccData = [];

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/profile/objectives`)
    .once('value', snapshot => {
      snapshot.exists() ?
      snapshot.forEach(snapChild => {
        snapChild.val().accomplished === true ?
        objAccData.push({
          name: snapChild.val().objectiveName,
          value: snapChild.val().objectiveValue,
          date: snapChild.val().accomplishedDate
        }) : 
        null;
      }) :
      null;
    })
    .then(dispatch({ type: FETCH_OBJECTIVES_ACCOMPLISHED, payload: objAccData }));
  };
};

export const fetchScoreAndHistoryData = () => {
  const { currentUser } = firebase.auth();
  const trainingHistoryData = [];

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/trainingSessions`)
    .once('value', snapshot => {
      snapshot.exists() ?
      (
        console.log(snapshot.val()),
        snapshot.forEach(snapChild => {
          trainingHistoryData.push({
            date: snapChild.val()[snapChild.val().length - 1].date,
            trainingId: snapChild.val()[snapChild.val().length - 1].trainingId,
            trainingName: snapChild.val()[snapChild.val().length - 1].trainingName,
            trainingScore: snapChild.val()[snapChild.val().length - 1].trainingScore,
            trainingHistory: snapChild.val()
          });
        }),
        trainingHistoryData.forEach(trainingData => {
          const lastIndex = trainingData.trainingHistory.length - 1;
          trainingData.trainingHistory.splice(lastIndex, 1);
        })
      ) :
      null;
    })
    .then(dispatch({ type: FETCH_TRAINING_HISTORY_DATA, payload: trainingHistoryData }));
  };
};
