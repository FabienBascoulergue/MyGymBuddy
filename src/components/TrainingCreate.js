import React, { Component } from 'react';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { 
  Text, 
  Modal, 
  FlatList,
  TouchableOpacity,
  View,
  Alert 
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Card, CardSection, Button, Input, ButtonRed } from './common';
import {
  trainingNameChanged,
  exercisesFetch,
  exerciseNameChanged,
  createExercise,
  createTraining,
  nbSetsChanged,
  notesChanged
} from '../actions';

class TrainingCreate extends Component {
  state = { 
    showCreateExercise: false, 
    showDeleteExercise: false, 
    showCreateTraining: false,
    showSelectExercise: false,
    pressedExerciseName: '',
    pressedExerciseId: '',
    exerciseData: [], 
    exerciseSelectedData: [],
    itemToDeleteId: '',
    itemToDeleteName: ''
  };
  

  componentWillMount() {
    this.props.exercisesFetch();
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    
    this.setState({ exerciseData: nextProps.exercises });
  }
  
  onTrainingNameChange(text) {
    this.props.trainingNameChanged(text);
  }
  
  onExerciseNameChange(text) {
    this.props.exerciseNameChanged(text);
  }

  onNbSetsChange(text) {
    this.props.nbSetsChanged(text);
  }

  onNotesChange(text) {
    this.props.notesChanged(text);
  }

  onAcceptCreateTraining() {
    const { trainingName } = this.props;
    const { exerciseSelectedData } = this.state;
    this.props.createTraining({ trainingName, exerciseSelectedData });
    this.setState({ exerciseSelectedData: [] });
    this.setState({ showCreateTraining: false });
  }

  onAcceptCreateExercise() {
    const { exerciseName } = this.props;
    exerciseName !== '' ?
      (this.props.createExercise({ exerciseName }),
      this.setState({ showCreateExercise: false }))
      : Alert.alert(
        'No Exercise Name',
        'Cannot create an unnamed Exercise'
      );    
  }

  onDecline() {
    this.setState({ showCreateExercise: false });
    this.setState({ showDeleteExercise: false });
    this.setState({ showCreateTraining: false });
    this.setState({ showSelectExercise: false });
  }

  onAcceptDelete() {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}/exercises/${this.state.itemToDeleteId}`)
      .remove();
    this.setState({ showDeleteExercise: !this.state.showDeleteExercise });
  }

  onExercisePress({ item }) {
    this.setState({ showSelectExercise: true });
    this.setState({ pressedExerciseName: item.exerciseName });
    this.setState({ pressedExerciseId: item.uid });
  }

  onAcceptSelectExercise() {
    this.props.nbSets !== '' ?
      (this.setState({ exerciseSelectedData: 
        [...this.state.exerciseSelectedData, 
          { 
            exerciseName: this.state.pressedExerciseName, 
            exerciseID: this.state.pressedExerciseId,
            nbSets: this.props.nbSets, 
            notes: this.props.notes
          }
        ] 
      }),
      this.setState({ showSelectExercise: false }))
      : Alert.alert(
        'Number of Sets not specified',
        'Specify the number of sets for this exercise in this training please'
      );
  }

  onExerciseLongPress({ item }) {
    this.setState({ itemToDeleteId: item.uid });
    this.setState({ itemToDeleteName: item.exerciseName });
    this.setState({ showDeleteExercise: true });    
  }

  onSelectedExercisePress({ item }, index) {
    this.state.exerciseSelectedData.splice(index, 1);
    this.forceUpdate();
  }
  
  renderExercises({ item, index }) {
    return (
      <TouchableOpacity 
        onPress={() => this.onExercisePress({ item })}
        onLongPress={() => this.onExerciseLongPress({ item, index })}
      >
        <View>
          <CardSection>
            <Text>
              {item.exerciseName}
            </Text>
          </CardSection>
        </View>
      </TouchableOpacity>
    );
  }
  
  renderSelectedExercises({ item, index }) {
    return (
      <TouchableOpacity onPress={() => this.onSelectedExercisePress({ item }, index)}>
        <View>
          <CardSection>
            <Text style={{ flex: 1 }}>
              {item.exerciseName}
            </Text>
            <Text style={{ flex: 1 }}>
              {item.nbSets} Sets
            </Text>
            <Text style={{ flex: 1 }}>
              {item.notes}
            </Text>
          </CardSection>
        </View>
      </TouchableOpacity>
    );
  }
 
  render() {
    return (
      <Card>
       
        <CardSection>
          <Input 
              label="Name:"
              placeholder="My training name"
              onChangeText={this.onTrainingNameChange.bind(this)}
              value={this.props.trainingName}
          />
        </CardSection>

        <CardSection style={{ flexDirection: 'column', height: 180 }}>
          <Text style={styles.listHeaderTextStyle}>Select Exercises</Text>
          <Text style={styles.listSubTextStyle}>Press to select - Long Press to delete</Text>
          <FlatList
            data={_.orderBy(this.state.exerciseData, ['exerciseName'])}
            renderItem={this.renderExercises.bind(this)}
            extraData={this.state}
          />
        </CardSection>

        <CardSection style={{ flexDirection: 'column', height: 180 }}>
          <Text style={styles.listHeaderTextStyle}>Selected Exercises</Text>
          <Text style={styles.listSubTextStyle}>Press to remove</Text>
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            data={this.state.exerciseSelectedData}
            renderItem={this.renderSelectedExercises.bind(this)}
            extraData={this.state}
          />
        </CardSection>

        <CardSection>
          <Button 
            onPress={() => this.setState({ showCreateExercise: !this.state.showCreateExercise })}
          >
            Create a new Exercise
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={() => Actions.trainingList()}>
            View my other trainings
          </Button>
        </CardSection>

        <CardSection>
          <Button 
            onPress={() => (
              (this.props.trainingName !== '' && this.state.exerciseSelectedData.length !== 0) ?
              this.setState({ showCreateTraining: !this.state.showCreateTraining }) 
              : Alert.alert(
                'No Training Name or Empty Selection', 
                'Please enter a training name and make sure to select Exercises'
              )
            )} 
          >
            Create this training !
          </Button>
        </CardSection>

{/* Popup to Create an Exercise*/}
        <Modal
          visible={this.state.showCreateExercise}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Input 
                label="Exercise Name"
                placeholder="My Exercise"
                onChangeText={this.onExerciseNameChange.bind(this)}
                value={this.props.exerciseName}
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptCreateExercise.bind(this)}>Create my Exercise</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to Delete an Exercise*/}
        <Modal
          visible={this.state.showDeleteExercise}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Do you really want to delete {this.state.itemToDeleteName} from your exercises ?
              </Text>
            </CardSection>

            <CardSection>
            <ButtonRed onPress={this.onAcceptDelete.bind(this)}>Delete</ButtonRed>
            <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to Create the Training*/}
        <Modal
          visible={this.state.showCreateTraining}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Do you really want to create the training:  {this.props.trainingName} ?
              </Text>
            </CardSection>

            <CardSection>
            <Button onPress={this.onAcceptCreateTraining.bind(this)}>
              Create Training
            </Button>
            <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to specify 'nbSet' and 'notes' for an Exercise in the Training */}
        <Modal
          visible={this.state.showSelectExercise}
          transparent
          animation="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Specify informations about 
                exercise:  {this.state.pressedExerciseName} in this training
              </Text>
            </CardSection>
            <CardSection>
              <Input 
                label="Number of sets"
                placeholder="4"
                onChangeText={this.onNbSetsChange.bind(this)}
                value={this.props.nbSets}
                keyboardType='numeric'
              />
            </CardSection>
            <CardSection>
              <Input 
                label="Notes"
                placeholder="Indications/Notes"
                onChangeText={this.onNotesChange.bind(this)}
                value={this.props.notes}
                maxLength={150}
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptSelectExercise.bind(this)}>Select Exercise</Button>
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

const mapStateToProps = state => {
  const { trainingName, exerciseName, nbSets, notes } = state.trainingCreate;
  const exercises = _.map(state.exercises, (val, uid) => {
    return { ...val, uid }; 
  });

  return { exercises, trainingName, exerciseName, nbSets, notes };
};


export default connect(mapStateToProps, 
  { 
    trainingNameChanged,
    exercisesFetch,
    exerciseNameChanged,
    createExercise,
    createTraining,
    nbSetsChanged,
    notesChanged
  })(TrainingCreate);
