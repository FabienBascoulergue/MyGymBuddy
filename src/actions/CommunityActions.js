import firebase from 'firebase';
import {
  LEADERBOARD_SELECTED,
  FETCH_USERS,
  ADD_FRIEND,
  REMOVE_FRIEND,
  FETCH_FRIENDLIST,
  FILTER_FRIENDS,
  FETCH_FRIEND_REQUESTS,
  FETCH_LEADERBOARD_DATA
} from './types';

export const leaderboardSelected = (text) => {
  return {
    type: LEADERBOARD_SELECTED,
    payload: text
  };
};

export const usersFetch = () => {
  const { currentUser } = firebase.auth();
  const users = [];

  return (dispatch) => {
    firebase.database().ref('users')
      .once('value', snapshot => {
        snapshot.forEach(childSnapshot => {     
          let uid = childSnapshot.key;
          let profileName = childSnapshot.child('profile/profileName').val() || 'unnamed';
          let description = childSnapshot.child('profile/description').val() || 'no description';

          uid !== currentUser.uid ?
          users.push({ uid, profileName, description }) :
          null;
        });
      })
      .then(dispatch({ type: FETCH_USERS, payload: users }));
  };
};

export const addFriend = (uid) => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
  dispatch({ type: ADD_FRIEND, payload: uid });
  firebase.database().ref(`/users/${currentUser.uid}/community/friends`)
    .push(uid);
  };
};

export const friendListFetch = () => {
  const { currentUser } = firebase.auth();
  const friendListUid = [];

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/community/friends`)
      .once('value', snapshot => {
        snapshot.forEach(childSnapshot => { 
          friendListUid.push(childSnapshot.val());
        });
      })
      .then(dispatch({ type: FETCH_FRIENDLIST, payload: friendListUid }));
    };
};

export const friendRequestsFetch = ({ friendListUid }) => {
  const { currentUser } = firebase.auth();
  let friends = [];
  const friendRequests = [];
  let isRequested = false;

  return (dispatch) => {
    firebase.database().ref('/users')
    .once('value', snapshot => {
      snapshot.forEach((childSnapshot) => {
        childSnapshot.child('community/friends').exists() === true ?
        friends = childSnapshot.val().community.friends :
        friends = {};

        console.log('friends');
        console.log(friends);
        console.log('currentUser.uid');
        console.log(currentUser.uid);

        (Object.values(friends).indexOf(currentUser.uid) > -1 &&
        friendListUid.includes(childSnapshot.key) === false) ?
        friendRequests.push({ 
          uid: childSnapshot.key, 
          profileName: childSnapshot.val().profile.profileName || 'Unnamed',
          description: childSnapshot.val().profile.description || 'No description'
        }) :
        null;

        console.log('friendRequests');
        console.log(friendRequests);
      });
      dispatch({ type: FETCH_FRIEND_REQUESTS, payload: friendRequests });
    });
  };
};

export const filterFriends = ({ users, friendListUid }) => {
  const friendListFiltered = [];
  const { currentUser } = firebase.auth();
  let isFriend = false;
  return (dispatch) => {
    console.log('users, friendListUid /filterFriends');
    console.log({ users, friendListUid });
    users.forEach((user) => {
      console.log(firebase.database().ref(`/users/${user.uid}/community/friends`)
      .orderByValue().equalTo(currentUser.uid));

      isFriend = false;
      firebase.database().ref(`/users/${user.uid}/community/friends`)
        .once('value', snapshot => {
          console.log('snapshot.val()');
          console.log(snapshot.val());
          snapshot.exists() ?
          snapshot.forEach((childSnapshot) => {
            console.log('childSnapshot.val()');
            console.log(childSnapshot.val());
            childSnapshot.val() === currentUser.uid ? isFriend = true : null;
            console.log(isFriend);
            console.log('isFriend');
          }) :
          isFriend = false;  
          console.log('isFriend//THEN');
          console.log(isFriend);
          (friendListUid.includes(user.uid) && isFriend === true) ?
          friendListFiltered.push(user) :
          null;
        });
    });
    setTimeout(() => {
      console.log('friendListFiltered');
      console.log(friendListFiltered);
      dispatch({ type: FILTER_FRIENDS, payload: friendListFiltered });
    }, 1000);
  };
};

export const removeFriend = (uid) => {
  const { currentUser } = firebase.auth();
  
    return (dispatch) => {
    dispatch({ type: REMOVE_FRIEND, payload: uid });
    firebase.database().ref(`/users/${currentUser.uid}/community/friends`)
      .orderByValue().equalTo(uid)
      .once('value', snapshot => {
        snapshot.forEach(childSnapshot => { 
          firebase.database().ref(`/users/${currentUser.uid}/community/friends`)
          .child(childSnapshot.key).remove();
        });
      });
    };
};

export const fetchLeaderboardData = (friendListUid) => {
  const friendListStatistics = [];
  const userList = friendListUid;
  const { currentUser } = firebase.auth();
  userList.push(currentUser.uid);
  console.log(userList);

  return (dispatch) => {
    userList.forEach(userUid => {
      const friendStatistics = {};
      firebase.database().ref(`/users/${userUid}/profile`)
      .once('value', snapshot => {
        snapshot.exists() ?
        (
          friendStatistics.name = snapshot.val().profileName || 'Unnamed',
          friendStatistics.level = snapshot.val().level || 1,
          friendStatistics.experienceTotal = snapshot.val().experienceTotal || 0
        ) :
        (
          friendStatistics.name = 'Unnamed',
          friendStatistics.level = 1,
          friendStatistics.experienceTotal = 0
        );
      })
      .then(
        firebase.database().ref(`/users/${userUid}/statistics/max1Rep`)
        .once('value', snapshot => {
          snapshot.exists() ?
          (
            friendStatistics.maxBench = snapshot.val().maxBench || 0,
            friendStatistics.maxSquat = snapshot.val().maxSquat || 0,
            friendStatistics.maxDeadlift = snapshot.val().maxDeadlift || 0
          ) :
          (
            friendStatistics.maxBench = 0,
            friendStatistics.maxSquat = 0,
            friendStatistics.maxDeadlift = 0
          );
          friendStatistics.max1Rep = 
            friendStatistics.maxDeadlift + 
            friendStatistics.maxSquat +
            friendStatistics.maxBench
          ;
        })
      )
      .then(friendListStatistics.push(friendStatistics));
      console.log(friendListStatistics);
    });
    setTimeout(() => { 
      dispatch({ type: FETCH_LEADERBOARD_DATA, payload: friendListStatistics }); 
    }, 1000);
  };
};
