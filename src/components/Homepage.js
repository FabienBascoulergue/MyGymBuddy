import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Card, CardSection, Button } from './common';
import { profileFetch, friendListFetch } from '../actions';

class Homepage extends Component {
  componentWillMount() {
    this.props.profileFetch();
    this.props.friendListFetch();
  }

  render() {
    const nextLevelExp = (3000 * Math.trunc(this.props.level)) + 7000;

    return (
      <Card style={{ flex: 1, justifyContent: 'space-between', marginBottom: 10 }}>
        
        <TouchableOpacity onPress={() => Actions.profile()}>
          <CardSection style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
            this.props.pictureUri ?
            <Image 
              style={{ width: 100, height: 100, resizeMode: Image.resizeMode.stretch }} 
              source={{ uri: this.props.pictureUri }} 
            /> :
            <Image
              style={{ width: 100, height: 100 }}
              source={require('../../img/Profile_Logo.png')}
            />
            }
            <View>          
              <Text style={{ paddingLeft: 10, fontSize: 18 }}>
                Profile - {this.props.profileName}
              </Text>
              <Text style={{ paddingLeft: 10, color: 'blue', fontSize: 12 }}>
                Level {Math.trunc(this.props.level)} - Exp. {this.props.experienceCurrent} / {nextLevelExp}
              </Text>
              <Text style={{ paddingLeft: 10, color: 'blueviolet', fontSize: 12 }}>
                Overall Experience: {this.props.experienceTotal}
              </Text>

            </View>
          </CardSection>
        </TouchableOpacity>

        <CardSection style={{ borderBottomWidth: 0 }}>
          <Button onPress={() => Actions.startTraining()}>Start Training</Button>
        </CardSection>

        <CardSection style={{ borderBottomWidth: 0 }}>
          <Button onPress={() => Actions.trainingCreate()}>Create a training</Button>
        </CardSection>

        <CardSection style={{ borderBottomWidth: 0 }}>
          <Button onPress={() => Actions.statistics()}>My Statistics</Button>
        </CardSection>

        <CardSection style={{ borderBottomWidth: 0 }}>
          <Button onPress={() => Actions.community()}>My Community</Button>
        </CardSection>

{/* Settings, Tips and Help buttons */}
        <CardSection style={{ flexDirection: 'column' }}>
          <View style={styles.viewStyle}>
            <TouchableOpacity>
              <Image
                style={{ width: 50, height: 50 }}
                source={require('../../img/Settings_Logo.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={{ width: 50, height: 50 }}
                source={require('../../img/Information_Logo.jpg')}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={{ width: 50, height: 50 }}
                source={require('../../img/Help_Logo.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.viewStyle}>
            <Text>Settings</Text>
            <Text style={{ paddingRight: 17 }}>Tips</Text>
            <Text style={{ paddingRight: 5 }}>Help</Text>
          </View>
          </CardSection>

      </Card>
    );
  }

}

const styles = {
  viewStyle: {
    alignSelf: 'stretch', 
    flexDirection: 'row', 
    justifyContent: 'space-around'
  }
};

const mapStateToProps = ({ profile }) => {
  const { profileName, height, weight, pictureUri, level, experienceCurrent, experienceTotal } = profile;

  return { profileName, height, weight, pictureUri, level, experienceCurrent, experienceTotal };
};

export default connect(mapStateToProps, { profileFetch, friendListFetch })(Homepage);
