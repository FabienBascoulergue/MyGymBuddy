import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import Homepage from './components/Homepage';
import TrainingCreate from './components/TrainingCreate';
import TrainingList from './components/TrainingList';
import StartTraining from './components/StartTraining';
import TrainingStarted from './components/TrainingStarted';
import Profile from './components/Profile';
import Community from './components/Community';
import FriendList from './components/FriendList';
import Objectives from './components/Objectives';
import Statistics from './components/Statistics';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 65 }}>
      <Scene key="auth" initial>
        <Scene key="login" component={LoginForm} title="Please Login" />
      </Scene>

      <Scene key="main">
        <Scene 
//        onRight={() => Actions.employeeCreate()}
//        rightTitle="Add"
        key="homepage" 
        component={Homepage} 
        title="Homepage" 
        initial
        />

        <Scene 
        key="profile"
        component={Profile}
        title="Profile"
        />
        
        <Scene 
        key="objectives"
        component={Objectives}
        title="My Objectives"
        />

        <Scene 
        key="startTraining"
        component={StartTraining}
        title="Start Training"
        />

        <Scene 
        key="trainingCreate"
        component={TrainingCreate}
        title="Create A Training"
        />

        <Scene 
        key="trainingList"
        component={TrainingList}
        title="Manage Trainings"
        />

        <Scene 
        key="statistics"
        component={Statistics}
        title="My Statistics"
        />

        <Scene 
        key="community"
        component={Community}
        title="Community"
        />

        <Scene 
        key="friendlist"
        component={FriendList}
        title="Friendlist"
        />

        
      </Scene>

      <Scene key="duringTraining">
        <Scene 
        key="trainingStarted"
        component={TrainingStarted}
        title="Train !"
        initial
        />
      </Scene>
      
    </Router>
  );
};

export default RouterComponent;
