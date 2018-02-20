import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { CardSection, Button } from '../common';

class TrainingHistory extends Component {
  state = {
    showTrainingDetails: false,
    pressedTrainingName: '',
    pressedTrainingDate: '',
    pressedTrainingScore: 0,
    pressedTrainingData: []
  }

  onTrainingPress(item, date) {
    this.setState({
      pressedTrainingName: item.trainingName,
      pressedTrainingData: item.trainingHistory,
      pressedTrainingDate: date,
      pressedTrainingScore: item.trainingScore,
      showTrainingDetails: true
    });
  }

  onClose() {
    this.setState({ showTrainingDetails: false });
  }

  renderTrainingHistory({ item }) {
    const date = `${item.date.substr(8, 2)}/${item.date.substr(5, 2)}/${item.date.substr(0, 4)}  ${item.date.substr(11, 5)}`;
    return (
      <TouchableOpacity onPress={() => this.onTrainingPress(item, date)}>
        <CardSection>
          <Text style={{ flex: 1 }}>{date}</Text>
          <Text style={{ flex: 2 }}>{item.trainingName}</Text>
          <Text style={{ flex: 1 }}>{item.trainingScore}</Text>
        </CardSection>
      </TouchableOpacity>
    );
  }

  renderExercise({ item, index }) {
    return (
      <CardSection style={{ flexDirection: 'column' }}>
        <Text style={{ alignSelf: 'center' }}>Set {index + 1}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ paddingLeft: 20, flex: 3 }}>Intensity (kg):</Text>
          <Text style={{ flex: 1 }}>{item.intensity}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ paddingLeft: 20, flex: 3 }}>Nb repetitions:</Text>
          <Text style={{ flex: 1 }}>{item.nbRep}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ paddingLeft: 20, flex: 3 }}>Duration under stress (s):</Text>
          <Text style={{ flex: 1 }}>{item.duration}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ paddingLeft: 20, flex: 3 }}>Resting time after set (s):</Text>
          <Text style={{ flex: 1 }}>{item.rest}</Text>
        </View>
      </CardSection>
    );
  }

  renderTrainingDetails({ item }) {
    return (
      <View>
        <CardSection>
          <Text style={{ flex: 3, fontSize: 20, fontWeight: 'bold' }}>{item.exerciseName}</Text>
          <Text style={{ flex: 1, fontSize: 16 }}>Sets: {item.set.length}</Text>
          <Text style={{ flex: 2, fontSize: 16 }}>Score: {Math.floor(item.exerciseScore)}</Text>
        </CardSection>
        <CardSection>
          <FlatList
            data={item.set}
            renderItem={this.renderExercise.bind(this)}
          />
        </CardSection>
      </View>
    );
  }

  render() {
    console.log('Props/State - RENDER Training History');
    console.log(this.props);
    console.log(this.state);
    return (
      <View style={{ height: 250 }}>
        <Text style={styles.listSubTextStyle}>Press for details</Text>
        <CardSection>
          <Text style={{ flex: 1, alignSelf: 'center' }}>date</Text>
          <Text style={{ flex: 2, alignSelf: 'center' }}>Training Name</Text>
          <Text style={{ flex: 1, alignSelf: 'center' }}>Score</Text>
        </CardSection>
        <FlatList
          data={_.sortBy(this.props.trainingHistoryData, 'date')}
          renderItem={this.renderTrainingHistory.bind(this)}
        />

{/* Popup to show pressed training details */}
        <Modal
          visible={this.state.showTrainingDetails}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                {
                `Details for ${this.state.pressedTrainingName} 
                saved on ${this.state.pressedTrainingDate}
                with a score of ${this.state.pressedTrainingScore}`
                }
              </Text>
            </CardSection>

            <CardSection>
              <View style={{ height: 300, width: Dimensions.get('window').width - 10 }}>
                <FlatList
                data={this.state.pressedTrainingData}
                renderItem={this.renderTrainingDetails.bind(this)}
                /> 
              </View>
            </CardSection>

            <CardSection>
              <Button onPress={() => this.onClose()}>
                close
              </Button>
            </CardSection>
          </View>
        </Modal>

      </View>
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
  const { trainingHistoryData } = state.statistics;

  return { trainingHistoryData };
};

export default connect(mapStateToProps, {

})(TrainingHistory);
