import {
  STATISTICS_SELECTED,
  FETCH_MAX1REP,
  FETCH_OBJECTIVES_ACCOMPLISHED,
  FETCH_TRAINING_HISTORY_DATA
} from '../actions/types';

const INITIAL_STATE = {
  displayStatistics: [
    'Score per month',
    'Objectives accomplished',
    'Max 1 Rep',
    'Training History'
  ],
  selectedStatistics: '',
  maxBench: 0,
  maxSquat: 0,
  maxDeadlift: 0,
  dataHistory: [],
  objAccData: [],
  trainingHistoryData: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STATISTICS_SELECTED:
      return { ...state, selectedStatistics: action.payload };
    case FETCH_MAX1REP:
      return { ...state, 
        maxBench: action.payload.maxBench,
        maxSquat: action.payload.maxSquat,
        maxDeadlift: action.payload.maxDeadlift,
        dataHistory: action.payload.dataHistory
      };
    case FETCH_OBJECTIVES_ACCOMPLISHED:
      return { ...state, objAccData: action.payload };
    case FETCH_TRAINING_HISTORY_DATA:
      return { ...state, trainingHistoryData: action.payload };
    default:
      return state;
  }
};
