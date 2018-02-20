import React, { Component } from 'react';
import { 
  Text, 
  FlatList,
  TouchableOpacity,
  View,
  Modal,
  Alert 
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Card, CardSection, Button, ButtonRed } from './common';
import { 
  usersFetch,
  addFriend,
  removeFriend,
  filterFriends,
  friendRequestsFetch
} from '../actions';

class FriendList extends Component {
  state = {
    showAddUser: false,
    showFriendDetails: false,
    showRemoveFriend: false, 
    pressedUserName: '',
    pressedUserDescription: '',
    pressedUserUid: '',
    pressedFriendName: '',
    pressedFriendDescription: '',
    pressedFriendUid: ''    
  }

  componentWillMount() {
    const users = this.props.users;
    const friendListUid = this.props.friendListUid;
    this.props.filterFriends({ users, friendListUid });
    this.props.friendRequestsFetch({ friendListUid });
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    this.forceUpdate();
  }

  onAcceptRequestAdd() {
    const uid = this.state.pressedUserUid;
    this.setState({ showAddUser: false });

    this.props.friendListUid.includes(uid) ?
    setTimeout(() => {
      Alert.alert('Request pending', 'A friend request is already pending for this user');
    }, 100) :
    this.props.addFriend(uid);
    setTimeout(() => {
      const users = this.props.users;
      const friendListUid = this.props.friendListUid;

      this.props.filterFriends({ users, friendListUid });
      this.props.friendRequestsFetch({ friendListUid });
    }, 300);
  }

  onAcceptRemoveFriend() {
    const uid = this.state.pressedFriendUid;
    this.props.removeFriend(uid);
    this.setState({ showRemoveFriend: false });
    setTimeout(() => {
      const users = this.props.users;
      const friendListUid = this.props.friendListUid;

      this.props.filterFriends({ users, friendListUid });
      this.props.friendRequestsFetch({ friendListUid });
    }, 300);
  }

  onDecline() {
    this.setState({ 
      showAddUser: false,
      showFriendDetails: false,
      showRemoveFriend: false
    });
  }

  onUserPress({ item }) {
    this.setState({ 
      pressedUserName: item.profileName,
      pressedUserDescription: item.description,
      pressedUserUid: item.uid,
      showAddUser: true 
    });
  }

  onFriendPress({ item }) {
    this.setState({ 
      pressedFriendName: item.profileName,
      pressedFriendDescription: item.description,
      pressedFriendUid: item.uid,
      showFriendDetails: true 
    });
  }

  onFriendLongPress({ item }) {
    this.setState({ 
      pressedFriendName: item.profileName,
      pressedFriendDescription: item.description,
      pressedFriendUid: item.uid,
      showRemoveFriend: true 
    });
  }

  renderUsers({ item }) {
    return (
      <TouchableOpacity 
        onPress={() => this.onUserPress({ item })}
      >
        <View>
          <CardSection>
            <Text>
              {item.profileName}
            </Text>
          </CardSection>
        </View>
      </TouchableOpacity>
    );
  }

  renderFriends({ item }) {
    console.log('renderFriend');
    return (
      <TouchableOpacity 
        onPress={() => this.onFriendPress({ item })}
        onLongPress={() => this.onFriendLongPress({ item })}
      >
        <View>
          <CardSection>
            <Text>
              {item.profileName}
            </Text>
          </CardSection>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    console.log('this.props/render');
    console.log(this.props);
    console.log('this.state/render');
    console.log(this.state);
    
    return (
      <Card>
      
       <CardSection style={{ flexDirection: 'column', height: 180 }}>
         <Text style={styles.listHeaderTextStyle}>MyGymBuddy Users</Text>
         <Text style={styles.listSubTextStyle}>Press to request add</Text>
         <FlatList
           data={this.props.users}
           renderItem={this.renderUsers.bind(this)}
         />
        </CardSection>
        <CardSection style={{ flexDirection: 'column', height: 120 }}>
         <Text style={styles.listHeaderTextStyle}>Friend Requests</Text>
         <Text style={styles.listSubTextStyle}>Press to accept add</Text>
         <FlatList
           data={this.props.friendRequests}
           renderItem={this.renderUsers.bind(this)}
           extraData={this.state}
         />
       </CardSection>

       <CardSection style={{ flexDirection: 'column', height: 180 }}>
         <Text style={styles.listHeaderTextStyle}>My Friends</Text>
         <Text style={styles.listSubTextStyle}>Press to see details - Long Press to remove</Text>
         <FlatList
           data={this.props.friendList}
           renderItem={this.renderFriends.bind(this)}
           extraData={this.state}
         />
       </CardSection>

{/* Popup to send a Friend Request */}
        <Modal
          visible={this.state.showAddUser}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>User Name: { this.state.pressedUserName }</Text>
              <Text>User Description: { this.state.pressedUserDescription }</Text>
              <Text style={{ paddingTop: 20 }}>
                Do you want to send a friend request to { this.state.pressedUserName } ?
              </Text>
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptRequestAdd.bind(this)}>Add</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to see Friend details */}
        <Modal
          visible={this.state.showFriendDetails}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>User Name: { this.state.pressedFriendName }</Text>
              <Text>User Description: { this.state.pressedFriendDescription }</Text>
            </CardSection>

            <CardSection>
              <Button onPress={this.onDecline.bind(this)}>Close</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to Remove a Friend */}
        <Modal
          visible={this.state.showRemoveFriend}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text style={{ paddingTop: 20 }}>
                Do you really want to remove { this.state.pressedFriendName } from your friends ?
              </Text>
            </CardSection>

            <CardSection>
              <ButtonRed onPress={this.onAcceptRemoveFriend.bind(this)}>Remove</ButtonRed>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

      </Card>
    );
  }
}

const styles = {
  listHeaderTextStyle: {
    fontSize: 18,
    alignSelf: 'center'
  },
  listSubTextStyle: {
    fontSize: 12,
    alignSelf: 'center'
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  }
};

const mapStateToProps = ({ friendlist }) => {
  const { users, friendListUid, friendList, friendRequests } = friendlist;
  
  return { users, friendListUid, friendList, friendRequests };
};

export default connect(mapStateToProps, 
  { 
    usersFetch, 
    addFriend, 
    filterFriends,
    removeFriend,
    friendRequestsFetch
  })(FriendList);
