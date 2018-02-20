import React, { Component } from 'react';
import _ from 'lodash';
import { 
  Text, 
  Modal, 
  FlatList,
  TouchableOpacity,
  View 
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Card, CardSection, Button, ButtonRed } from './common';
import {
  trainingsFetch
} from '../actions';

class TrainingList extends Component {
  state = {
    trainingData: [],
    trainingSelectedData: [],
    pressedTrainingName: '',
    pressedTrainingId: '',
    showDeleteTraining: false
  };

  componentWillMount() {
    this.props.trainingsFetch();
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    
    this.setState({ trainingData: nextProps.trainings });
  }

  onTrainingPress({ item }) {
    this.setState({ trainingSelectedData: item.exerciseSelectedData });
    this.setState({ pressedTrainingName: item.trainingName });
    this.setState({ pressedTrainingId: item.uid });
  }

  onAcceptDelete() {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}/trainings/${this.state.pressedTrainingId}`)
      .remove();
    this.setState({ trainingSelectedData: [] });
    this.setState({ pressedTrainingName: '' });
    this.setState({ pressedTrainingId: '' });
    this.setState({ showDeleteTraining: false });
  }

  onDecline() {
    this.setState({ showDeleteTraining: false });
  }

  renderTrainings({ item, index }) {
    return (
      <TouchableOpacity 
        onPress={() => this.onTrainingPress({ item })}
      >
        <View>
          <CardSection>
            <Text>
              {item.trainingName}
            </Text>
          </CardSection>
        </View>
      </TouchableOpacity>
    );
  }

  renderSelectedTraining({ item, index }) {
    return (
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
    );
  }

  render() {
    return (
      <Card>
        <CardSection style={{ flexDirection: 'column', height: 220 }}>
          <Text style={styles.listHeaderTextStyle}>Select Training you want to inspect</Text>
          <Text style={styles.listSubTextStyle}>Press to select</Text>
          <FlatList
            data={_.orderBy(this.state.trainingData, ['trainingName'])}
            renderItem={this.renderTrainings.bind(this)}
          />
        </CardSection>

        <CardSection style={{ flexDirection: 'column', height: 220 }}>
          <Text style={styles.listHeaderTextStyle}>Selected Training:</Text>
          <Text style={{ fontSize: 16, alignSelf: 'center', paddingBottom: 10 }}>
            {this.state.pressedTrainingName}
            </Text>
          <FlatList
            data={this.state.trainingSelectedData}
            renderItem={this.renderSelectedTraining.bind(this)}
          />
        </CardSection>

        <CardSection>
            <ButtonRed 
              onPress={this.state.pressedTrainingId !== '' ? 
                () => this.setState({ showDeleteTraining: !this.state.showDeleteTraining }) : null
              }
            >
              Delete selected Training
            </ButtonRed>
        </CardSection>

{/* Popup to Delete a Training*/}
        <Modal
          visible={this.state.showDeleteTraining}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Do you really want to delete {this.state.pressedTrainingName} from your trainings ?
              </Text>
            </CardSection>

            <CardSection>
              <ButtonRed onPress={this.onAcceptDelete.bind(this)}>Delete</ButtonRed>
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
  const trainings = _.map(state.trainings, (val, uid) => {
    return { ...val, uid }; 
  });

  return { trainings };
};

export default connect(mapStateToProps, 
  {
    trainingsFetch
  })(TrainingList);
