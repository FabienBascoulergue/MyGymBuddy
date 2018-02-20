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
 } from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  createemail: '',
  createpassword: '',
  user: null,
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case CREATEEMAIL_CHANGED:
      return { ...state, createemail: action.payload };
    case CREATEPASSWORD_CHANGED:
      return { ...state, createpassword: action.payload };
    case LOGIN_USER:
      return { ...state, loading: true, error: '' };
    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case LOGIN_USER_FAIL:
      return { ...state, error: 'Authentication Failed.', password: '', loading: false };
    case CREATE_USER_FAILED:
      return { ...state, 
        error: `Creation failed: ${action.payload.message}`, 
        password: '', 
        loading: false 
      };
    case CREATE_USER:
      return { ...state, loading: true, error: '' };
    default:
      return state;
  }
};
