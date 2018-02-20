import React, { Component } from 'react';
import { 
  Text, 
  FlatList,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection } from './common';
import { 
  statisticsSelected,
  fetchMax1Rep,
  fetchObjectivesAccomplished,
  fetchScoreAndHistoryData
} from '../actions';
import Max1Rep from './statisticsTag/Max1Rep';
import ObjectivesAccomplished from './statisticsTag/ObjectivesAccomplished';
import ScorePerMonth from './statisticsTag/ScorePerMonth';
import TrainingHistory from './statisticsTag/TrainingHistory';

class Statistics extends Component {

  componentWillMount() {
    this.props.fetchMax1Rep();
    this.props.fetchObjectivesAccomplished();
    this.props.fetchScoreAndHistoryData();
  }

  onStatisticsPress(item) {
    this.props.statisticsSelected(item);
  }

  renderStatisticsSelection({ item }) {
    return (
      <TouchableOpacity 
        onPress={() => this.onStatisticsPress(item)}
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
    console.log(this.props);
    console.log(this.state);
    return (
      <Card>
      
        <CardSection style={{ flexDirection: 'column', height: 155 }}>
          <Text style={styles.listHeaderTextStyle}>Statistics</Text>
          <Text style={styles.listSubTextStyle}>-Press to select-</Text>
          <FlatList
            data={this.props.displayStatistics}
            renderItem={this.renderStatisticsSelection.bind(this)}
          />
        </CardSection>

        <CardSection style={{ flexDirection: 'column' }}> 
          <Text style={styles.listHeaderTextStyle}>{this.props.selectedStatistics}</Text>

          {
            this.props.selectedStatistics === 'Score per month' ?
            <ScorePerMonth /> :
            null
          }

          {
            this.props.selectedStatistics === 'Objectives accomplished' ?
            <ObjectivesAccomplished /> :
            null
          }

          {
            this.props.selectedStatistics === 'Max 1 Rep' ?
            <Max1Rep /> :
            null
          }

          {
            this.props.selectedStatistics === 'Training History' ?
            <TrainingHistory /> :
            null
          }
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
  const { 
    displayStatistics, 
    selectedStatistics, 
    maxBench, 
    maxSquat, 
    maxDeadlift, 
    objAccData,
    trainingHistoryData
  } = state.statistics;

  return { 
    displayStatistics, 
    selectedStatistics, 
    maxBench, 
    maxSquat, 
    maxDeadlift, 
    objAccData,
    trainingHistoryData
  };
};

export default connect(mapStateToProps, {
  statisticsSelected,
  fetchMax1Rep,
  fetchObjectivesAccomplished,
  fetchScoreAndHistoryData
})(Statistics);
