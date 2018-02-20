import {
  LEADERBOARD_SELECTED,
  FETCH_LEADERBOARD_DATA
} from '../actions/types';

const INITIAL_STATE = {
  displayLeaderboards: [
    'Max 1 Rep',
    'Level - Overall Experience'
  ],
  selectedLeaderboard: '',
  leaderboardData: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LEADERBOARD_SELECTED:
      return { ...state, selectedLeaderboard: action.payload };
    case FETCH_LEADERBOARD_DATA:
      return { ...state, leaderboardData: action.payload };
    default:
      return state;
  }
};
