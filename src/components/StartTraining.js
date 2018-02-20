import React, { Component } from 'react';
import _ from 'lodash';
import { 
  Text, 
  Modal, 
  FlatList,
  TouchableOpacity,
  View 
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Card, CardSection, Button } from './common';
import {
  trainingsFetch,
  startTrainingData,
  startTrainingName,
  startTrainingId
} from '../actions';

class StartTraining extends Component {
  state = {
    trainingData: [],
    trainingSelectedData: [],
    pressedTrainingName: '',
    pressedTrainingId: '',
    showStartTraining: false
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

  onAcceptStart() {
    const { trainingSelectedData, pressedTrainingId, pressedTrainingName } = this.state;
    this.props.startTrainingData(trainingSelectedData);
    this.props.startTrainingName(pressedTrainingName);
    this.props.startTrainingId(pressedTrainingId);
    this.setState({ showStartTraining: false });
    console.log('this.props');
    console.log(this.props);
    Actions.duringTraining();
  }

  onDecline() {
    this.setState({ showStartTraining: false });
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
            extraData={this.state}
          />
        </CardSection>

        <CardSection style={{ flexDirection: 'column', height: 200 }}>
          <Text style={styles.listHeaderTextStyle}>Selected Training:</Text>
          <Text style={{ fontSize: 16, alignSelf: 'center', paddingBottom: 10 }}>
            {this.state.pressedTrainingName}
            </Text>
          <FlatList
            data={this.state.trainingSelectedData}
            renderItem={this.renderSelectedTraining.bind(this)}
            extraData={this.state}
          />
        </CardSection>

        <CardSection>
            <Button 
              onPress={this.state.pressedTrainingId !== '' ? 
                () => this.setState({ showStartTraining: !this.state.showStartTraining }) : null
              }
            >
              Start selected Training
            </Button>
        </CardSection>

{/* Popup to Start a Training*/}
        <Modal
          visible={this.state.showStartTraining}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Do you want to start the training:  {this.state.pressedTrainingName}  ?
              </Text>
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptStart.bind(this)}>Start !</Button>
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

  const { trainingData, trainingName, trainingId } = state.start;
  return { trainings, trainingData, trainingName, trainingId };
};

export default connect(mapStateToProps, 
  {
    trainingsFetch,
    startTrainingData,
    startTrainingName,
    startTrainingId
  })(StartTraining);
