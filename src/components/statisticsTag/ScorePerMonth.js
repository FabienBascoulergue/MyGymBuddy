import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  Modal,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { CardSection, Button } from '../common';
import ScoreBarItem from './ScoreBarItem';

class ScorePerMonth extends Component {
  state = {
    showTrainingHistory: false,
    pressedMonth: '',
    pressedData: []
  }

  onMonthPress(data) {
    this.setState({
      pressedMonth: data.monthDate,
      pressedData: data,
      showTrainingHistory: true
    });
  }

  generateColumns(dataByMonth) {
    const monthIndicator = ['2017-10', '2017-11', '2017-12', '2018-01'];

    const mappedColumns = monthIndicator.map(month => {
      let column;
      const data = dataByMonth.find(obj => obj.monthDate === month);

      data !== undefined ?
      column = (
        <View style={{ justifyContent: 'flex-end' }} key={month}>
          <TouchableOpacity onPress={() => this.onMonthPress(data)}>
            <ScoreBarItem 
              valueW1={data.w1Score}
              valueW2={data.w2Score}
              valueW3={data.w3Score}
              valueW4={data.w4Score}
              valueMonth={data.monthScore}
              monthDate={month}
            />
          </TouchableOpacity>
        </View>
      ) :
      column = (
        <View style={{ justifyContent: 'flex-end' }} key={month}>
          <TouchableOpacity >          
            <ScoreBarItem 
              valueW1={0}
              valueW2={0}
              valueW3={0}
              valueW4={0}
              valueMonth={0}
              monthDate={month}
            />
          </TouchableOpacity>
        </View>
      );

      return column;
    });
    return (
      mappedColumns
    );
  }

  sortByWeek(obj, dataByWeek) {
    obj.date.substr(8, 2) <= '07' ?
    dataByWeek[0].push(obj) :
    obj.date.substr(8, 2) <= '14' ?
    dataByWeek[1].push(obj) :
    obj.date.substr(8, 2) <= '21' ?
    dataByWeek[2].push(obj) :
    dataByWeek[3].push(obj);
    console.log('dataByWeek / sortByWeek');
    console.log(dataByWeek);
  }

  sortDataByMonthAndWeeks() {
    const { trainingHistoryData } = this.props;
    const dataByMonth = [];
    let monthDate = '';
    let dataByWeek = [[], [], [], []];
    _.sortBy(trainingHistoryData, 'date').forEach(obj => {
      obj.date.substr(0, 7) === monthDate ?
        this.sortByWeek(obj, dataByWeek) : 
        dataByWeek.length !== 0 ?
          (
            dataByMonth.push({ monthDate, dataByWeek }),
            dataByWeek = [[], [], [], []],
            this.sortByWeek(obj, dataByWeek)
          ) :
          this.sortByWeek(obj, dataByWeek);
        monthDate = obj.date.substr(0, 7);
    });
    dataByWeek.length !== 0 ?
    dataByMonth.push({ monthDate, dataByWeek }) :
    null;
    console.log('dataByMonth / sortDataByMonthAndWeeks');
    console.log(dataByMonth);
    return dataByMonth;
  }

  calculateScorePerPeriod(dataByMonth) {
    const dataByMonthUpdated = dataByMonth;
    let weekScore = 0;
    let monthScore = 0;

    dataByMonthUpdated.forEach(monthData => {
      console.log(monthData);
      console.log(monthData);
      monthData.dataByWeek[0].forEach(weekData => {
        weekScore += weekData.trainingScore;
      });
      monthData.w1Score = weekScore;
      monthScore += weekScore; 
      weekScore = 0;

      monthData.dataByWeek[1].forEach(weekData => {
        weekScore += weekData.trainingScore;
      });
      monthData.w2Score = weekScore;
      monthScore += weekScore; 
      weekScore = 0;

      monthData.dataByWeek[2].forEach(weekData => {
        weekScore += weekData.trainingScore;
      });
      monthData.w3Score = weekScore;
      monthScore += weekScore; 
      weekScore = 0;

      monthData.dataByWeek[3].forEach(weekData => {
        weekScore += weekData.trainingScore;
      });
      monthData.w4Score = weekScore;
      monthScore += weekScore; 
      weekScore = 0;

      monthData.monthScore = monthScore;
      monthScore = 0;
    });
    console.log('dataByMonthUpdated // calculateScorePerPeriod');
    console.log(dataByMonthUpdated);
    return dataByMonthUpdated;
  }

  render() {
    const { trainingHistoryData } = this.props;
    let dataByMonth = [];
    console.log('ObjAcc/Render1/ dataByMonth');
    console.log(dataByMonth);
    dataByMonth = this.sortDataByMonthAndWeeks();

    console.log('ObjAcc/Render2/ dataByMonth');
    console.log(dataByMonth);
    dataByMonth = this.calculateScorePerPeriod(dataByMonth);

    console.log('ObjAcc/Render3/ dataByMonth');
    console.log(dataByMonth);
    console.log('trainingHistoryData');
    console.log(trainingHistoryData);

    return (
      <View style={{ height: 250 }}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
        >
          {this.generateColumns(dataByMonth)}
        </ScrollView>
      
        <Modal
          visible={this.state.showTrainingHistory}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Score obtained during 
                : {this.state.pressedMonth.substr(5, 2)}/{this.state.pressedMonth.substr(0, 4)}
              </Text>
            </CardSection>

            <CardSection style={{ flexDirection: 'column' }}>
              <Text>
                Month Score: {this.state.pressedData.monthScore} points
              </Text>
              <Text>
                0 - 7: {this.state.pressedData.w1Score} points
              </Text>
              <Text>
                8 - 14: {this.state.pressedData.w2Score} points
              </Text>
              <Text>
                15 - 21: {this.state.pressedData.w3Score} points
              </Text>
              <Text>
                22 - end: {this.state.pressedData.w4Score} points
              </Text>

            </CardSection>

            <CardSection>
              <Button onPress={() => this.setState({ showTrainingHistory: false })}>
                Close
              </Button>
            </CardSection>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = {
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

})(ScorePerMonth);
