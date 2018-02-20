import {
  PROFILE_NAME_CHANGED,
  HEIGHT_CHANGED,
  WEIGHT_CHANGED,
  DESCRIPTION_CHANGED,
  PROFILE_CHANGES_SAVED,
  PICTURE_CHANGED,
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
} from '../actions/types';

const INITIAL_STATE = {
  profileName: 'Unnamed',
  weight: '',
  height: '',
  description: '',
  pictureUri: '',
  level: 1,
  experienceCurrent: 0,
  experienceTotal: 0,
  objectives: [],
  currentObjectives: [],
  accomplishedObjectives: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_NAME_CHANGED:
      return { ...state, profileName: action.payload };
    case WEIGHT_CHANGED:
      return { ...state, weight: action.payload };
    case HEIGHT_CHANGED:
      return { ...state, height: action.payload };
    case DESCRIPTION_CHANGED:
      return { ...state, description: action.payload };
    case PICTURE_CHANGED:
    return { ...state, pictureUri: action.payload };
    case PROFILE_CHANGES_SAVED:
      return state;
    case PROFILE_FETCH_SUCCESS:
      return state;
    case LEVEL_UPDATED:
      return { ...state, level: action.payload };
    case EXPERIENCE_CURRENT_UPDATED:
      return { ...state, experienceCurrent: action.payload };
    case EXPERIENCE_TOTAL_UPDATED:
      return { ...state, experienceTotal: action.payload };
    case OBJECTIVES_FETCH:
      return { ...state, objectives: action.payload };
    case OBJECTIVE_ADD:
      return { ...state,
        currentObjectives: [...state.currentObjectives, action.payload]
      };
    case FILTERED_ACCOMPLISHED_OBJECTIVES:
      return { ...state, accomplishedObjectives: action.payload };
    case FILTERED_CURRENT_OBJECTIVES:
      return { ...state, currentObjectives: action.payload };
    case CURRENT_OBJECTIVE_REMOVE:
      return { ...state, 
        currentObjectives: state.currentObjectives.filter(obj => obj.uid !== action.payload)
      };
    case CURRENT_OBJECTIVE_UPDATE:
      return { ...state, currentObjectives: action.payload };
    case OBJECTIVE_ACCOMPLISHMENT:
      return { ...state, 
        currentObjectives: action.payload.updatedCurrent,
        accomplishedObjectives: action.payload.updatedAccomplished
      };
    default:
      return state;
    }
  };
