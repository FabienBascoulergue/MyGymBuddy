import React, { Component } from 'react';
import { 
  Text, 
  FlatList,
  TouchableOpacity,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, CardSection, Button } from './common';
import { 
  leaderboardSelected,
  usersFetch,
  fetchLeaderboardData
} from '../actions';

class Community extends Component {
  componentWillMount() {
    this.props.usersFetch();
    console.log('ComponentWillMount friendListUid');
    console.log(this.props.friendListUid);
    this.props.fetchLeaderboardData(this.props.friendListUid);
  }

  onLeaderboardPress(item) {
    this.props.leaderboardSelected(item);
  }

  renderLeaderboardMax1Rep({ item }) {
    return (
      <CardSection style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 2, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ flex: 1 }}>Total: {item.max1Rep}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1 }}>Bench: {item.maxBench}</Text>
          <Text style={{ flex: 1 }}>Deadlift: {item.maxDeadlift}</Text>
          <Text style={{ flex: 1 }}>Squat: {item.maxSquat}</Text>
        </View>
      </CardSection>
    );
  }

  renderLeaderboardLevel({ item }) {
    return (
      <CardSection style={{ flexDirection: 'column' }}>
        <Text style={{ flex: 1, fontWeight: 'bold' }}>{item.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1 }}>level: {Math.floor(item.level)}</Text>
          <Text style={{ flex: 1 }}>Exp. Total: {item.experienceTotal}</Text>
        </View>
      </CardSection>
    );
  }

  renderLeaderboardSelection({ item }) {
    return (
      <TouchableOpacity 
        onPress={() => this.onLeaderboardPress(item)}
      >
        <View>
          <CardSection>
            <Text>
              {item}
            </Text>
          </CardSection>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    console.log('props/state // COmmunity');
    console.log(this.props);
    console.log(this.state);
    return (
      <Card>
      
       <CardSection style={{ flexDirection: 'column', height: 200 }}>
         <Text style={styles.listHeaderTextStyle}>Leaderboard</Text>
         <Text style={styles.listSubTextStyle}>- {this.props.selectedLeaderboard} -</Text>
        {
          this.props.selectedLeaderboard === 'Max 1 Rep' ?
          <FlatList
            data={_.orderBy(this.props.leaderboardData, 'max1Rep', 'desc')}
            renderItem={this.renderLeaderboardMax1Rep.bind(this)}
          /> :
          null
        }
        {
          this.props.selectedLeaderboard === 'Level - Overall Experience' ?
          <FlatList
            data={_.orderBy(this.props.leaderboardData, 'level', 'desc')}
            renderItem={this.renderLeaderboardLevel.bind(this)}
          /> :
          null
        }
       </CardSection>

       <CardSection style={{ flexDirection: 'column', height: 140 }}>
         <Text style={styles.listHeaderTextStyle}>Select Leaderboard to display</Text>
         <Text style={styles.listSubTextStyle}>Press to select</Text>
         <FlatList
//           ref={(ref) => { this.flatListRef = ref; }}
           data={this.props.displayLeaderboards}
           renderItem={this.renderLeaderboardSelection.bind(this)}
         />
       </CardSection>

       <CardSection>
         <Button 
           onPress={() => Actions.friendlist()}
         >
           View Friendlist
         </Button>
       </CardSection>

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

const mapStateToProps = (state) => {
    const { displayLeaderboards, selectedLeaderboard, leaderboardData } = state.community;
    const { friendListUid } = state.friendlist;
  
    return { displayLeaderboards, selectedLeaderboard, friendListUid, leaderboardData };
};

export default connect(mapStateToProps, 
  { 
    leaderboardSelected,
    usersFetch,
    fetchLeaderboardData
  })(Community);
