import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import TrainingCreateReducer from './TrainingCreateReducer';
import ExerciseReducer from './ExerciseReducer';
import TrainingReducer from './TrainingReducer';
import StartTrainingReducer from './StartTrainingReducer';
import SelectionReducer from './SelectionReducer';
import TrainingStartedReducer from './TrainingStartedReducer';
import ProfileReducer from './ProfileReducer';
import CommunityReducer from './CommunityReducer';
import FriendListReducer from './FriendListReducer';
import StatisticsReducer from './StatisticsReducer';

export default combineReducers({
  auth: AuthReducer,
  trainingCreate: TrainingCreateReducer,
  exercises: ExerciseReducer,
  trainings: TrainingReducer,
  start: StartTrainingReducer,
  selection: SelectionReducer,
  started: TrainingStartedReducer,
  profile: ProfileReducer,
  community: CommunityReducer,
  friendlist: FriendListReducer,
  statistics: StatisticsReducer
});
