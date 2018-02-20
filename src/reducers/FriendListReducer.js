import {
  FETCH_USERS,
  ADD_FRIEND,
  REMOVE_FRIEND,
  FETCH_FRIENDLIST,
  FILTER_FRIENDS,
  FETCH_FRIEND_REQUESTS
  } from '../actions/types';
  
  const INITIAL_STATE = {
    users: [],
    friendRequests: [],
    friendListUid: [],
    friendList: []
  };
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_USERS:
        return { ...state, users: action.payload };
      case ADD_FRIEND:
        return { ...state, friendListUid: [...state.friendListUid, action.payload] };
      case REMOVE_FRIEND:
        return { ...state, 
          friendListUid: state.friendListUid.filter(uid => uid !== action.payload) 
        };
      case FETCH_FRIENDLIST:
        return { ...state, friendListUid: action.payload };
      case FETCH_FRIEND_REQUESTS:
        return { ...state, friendRequests: action.payload };
      case FILTER_FRIENDS:
        return { ...state, friendList: action.payload };
      default:
        return state;
    }
  };
