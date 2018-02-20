import React, { Component } from 'react';
import update from 'immutability-helper';
import _ from 'lodash';
import { 
  Text, 
  Modal, 
  FlatList,
  LayoutAnimation,
  View 
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Card, CardSection, Button, ButtonRed } from './common';
import InputEx from './InputEx';
import {
  trainingDataSave
 } from '../actions';

class TrainingStarted extends Component {
  state = {
    showAbortTraining: false,
    showTrainingCompleted: false,
    dataExSetState: []
  }

  componentWillMount() {
// State setup for every Set of each exercise
    const { trainingData } = this.props;
    const dataExerciseSet = [];
    for (let i = 0; i < trainingData.length; i++) {      // 1st Exercise => i=0
      for (let j = 1; j <= trainingData[i].nbSets; j++) {    // 1st Set => j=1
        dataExerciseSet.push(
// i,j = ExerciseIndex,SetIndex 
          { 
            key: `${i}_${j}`,
            exerciseName: trainingData[i].exerciseName,
            exerciseID: trainingData[i].exerciseID,
            exerciseIndex: i,
            setIndex: j, 
            intensity: '', 
            nbRep: '', 
            duration: '', 
            rest: '' 
          }
        ); 
      }
    }
    this.setState({ dataExSetState: dataExerciseSet });
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  onDecline() {
    this.setState({ showAbortTraining: false });
    this.setState({ showTrainingCompleted: false });
  }

  onAcceptComplete() {
    this.setState({ showTrainingCompleted: false });
    this.props.trainingDataSave(
      this.state.dataExSetState, 
      this.props.trainingName, 
      this.props.trainingId,
      this.props.weight,
      this.props.experienceCurrent, 
      this.props.experienceTotal, 
      this.props.level
    );
  }

  onAcceptAbort() {
    this.setState({ showAbortTraining: false });
    Actions.main();
  }

  onIntensityChange(key, text) {
    const { dataExSetState } = this.state;
    const index = _.findIndex(dataExSetState, { key });
    const newDataExSetState = update(dataExSetState, { [index]: { intensity: { $set: text } } });
    this.setState({ dataExSetState: newDataExSetState });
  }

  onNbRepChange(key, text) {
    const { dataExSetState } = this.state;
    const index = _.findIndex(dataExSetState, { key });
    const newDataExSetState = update(dataExSetState, { [index]: { nbRep: { $set: text } } });
    this.setState({ dataExSetState: newDataExSetState });
  }

  onDurationChange(key, text) {
    const { dataExSetState } = this.state;
    const index = _.findIndex(dataExSetState, { key });
    const newDataExSetState = update(dataExSetState, { [index]: { duration: { $set: text } } });
    this.setState({ dataExSetState: newDataExSetState });
  }

  onRestChange(key, text) {
    const { dataExSetState } = this.state;
    const index = _.findIndex(dataExSetState, { key });
    const newDataExSetState = update(dataExSetState, { [index]: { rest: { $set: text } } });
    this.setState({ dataExSetState: newDataExSetState });
  }

  renderExerciseDetail({ item, index }) {
    const key = item.key;

    return (
      <View>
        <CardSection style={{ flexDirection: 'column' }}>
          <Text style={{ alignSelf: 'center', paddingBottom: 5 }}>
            Set {item.setIndex}
          </Text>

          <InputEx 
              label='Intensity (kg):'
              placeholder='0'
              keyboardType='numeric'
              onChangeText={(text) => this.onIntensityChange(key, text)}
          />
          <InputEx 
              label='Nb repetitions:'
              placeholder='0'
              keyboardType='numeric'
              onChangeText={(text) => this.onNbRepChange(key, text)}
          />
          <InputEx 
              label='Duration under stress (s):'
              placeholder='0'
              keyboardType='numeric'
              onChangeText={(text) => this.onDurationChange(key, text)}
          />
          <InputEx 
              label='Resting time after set (s):'
              placeholder='0'
              keyboardType='numeric'
              onChangeText={(text) => this.onRestChange(key, text)}
          />
        </CardSection>
      </View>
    );
  }

  renderExercise({ item, index }) {
    const exerciseDetail = this.state.dataExSetState
      .filter((object) => (object.exerciseIndex === index));

    return ( 
      <FlatList
        data={exerciseDetail}
        renderItem={this.renderExerciseDetail.bind(this)}
        keyExtractor={object => object.key}
      />
    );
  }

  renderTraining({ item, index }) {
    return (
        <View>
          <CardSection>
            <Text style={styles.exerciseHeaderTextStyle}>
              {item.exerciseName}
            </Text>
            <Text style={{ flex: 1, fontSize: 16 }}>
              {item.nbSets} Sets
            </Text>
            <Text style={{ flex: 1 }}>
              Notes: {item.notes}
            </Text>
          </CardSection>
          {this.renderExercise({ item, index })}
        </View>
    );
  }

  render() {
    return (
      <Card>
        <CardSection style={{ height: 425 }}>
          <FlatList
            data={this.props.trainingData}
            renderItem={this.renderTraining.bind(this)}
          />
        </CardSection>

        <CardSection>
        <Button onPress={() => this.setState({ showTrainingCompleted: true })}>
            Training Completed !
          </Button>
        </CardSection>

        <CardSection>
          <ButtonRed onPress={() => this.setState({ showAbortTraining: true })}>
            Abort Training
          </ButtonRed>
        </CardSection>

{/* Popup to Abort the Training*/}
        <Modal
          visible={this.state.showTrainingCompleted}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Do you want to complete your training ? 
                Training data will be saved and you'll back to Homepage
              </Text>
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptComplete.bind(this)}>Accept</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to Abort the Training*/}
        <Modal
          visible={this.state.showAbortTraining}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Do you really want to abort training ? 
                You'll back to Homepage and this training session data will be lost
              </Text>
            </CardSection>

            <CardSection>
              <ButtonRed onPress={this.onAcceptAbort.bind(this)}>Abort</ButtonRed>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

      </Card>
    );
  }
}

const styles = {
  exerciseHeaderTextStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1
  },
  exerciseDetailTextStyle: {
    fontSize: 14,
    paddingLeft: 40,
    paddingBottom: 5
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  }
};

const mapStateToProps = (state) => {
  const { trainingData, trainingName, trainingId } = state.start;
  const { weight, experienceCurrent, experienceTotal, level } = state.profile;
  
  return { trainingData, trainingName, trainingId, weight, experienceCurrent, experienceTotal, level };
};

export default connect(mapStateToProps, 
  {
    trainingDataSave
  })(TrainingStarted);
