import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { CardSection, Button } from '../common';
import ObjectivesBarItem from './ObjectivesBarItem';

class ObjectivesAccomplished extends Component {
  state = {
    showObjectivesHistory: false,
    objectivesPressedMonth: '',
    objectivesPressedData: []
  }

  onMonthPress(data) {
    this.setState({
      objectivesPressedMonth: data.monthDate,
      objectivesPressedData: data.sortingByMonth,
      showObjectivesHistory: true
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
            <ObjectivesBarItem 
              value={data.sortingByMonth.length}
              color={'blue'}
              monthDate={month}
            />
          </TouchableOpacity>
        </View>
      ) :
      column = (
        <View style={{ justifyContent: 'flex-end' }} key={month}>
          <TouchableOpacity >          
            <ObjectivesBarItem 
              value={0}
              color={'blue'}
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

  renderObjectivesHistory({ item }) {
    const subDate = `${item.date.substr(8, 2)}/${item.date.substr(5, 2)}/${item.date.substr(0, 4)}`; 
    
    return (
      <View>
        <CardSection>
        <Text style={{ flex: 1 }}>
              {item.name}
            </Text>
            <Text style={{ flex: 1 }}>
              Goal: {item.value}
            </Text>
            <Text style={{ flex: 1 }}>
              Date: {subDate}
            </Text>
        </CardSection>
      </View>
    );
  }

  render() {
    const { objAccData } = this.props;
    const dataByMonth = [];
    let sortingByMonth = [];
    let monthDate = '';
    _.sortBy(objAccData, 'date').forEach(obj => {
      obj.date.substr(0, 7) === monthDate ?
      sortingByMonth.push(obj) :
        sortingByMonth.length !== 0 ?
        (dataByMonth.push({ monthDate, sortingByMonth }), 
        sortingByMonth = [],
        sortingByMonth.push(obj)) :
        sortingByMonth.push(obj);
      monthDate = obj.date.substr(0, 7);
    });

    sortingByMonth.length !== 0 ?
    dataByMonth.push({ monthDate, sortingByMonth }) :
    null;

    console.log('ObjAcc/Render/ dataByMonth');
    console.log(dataByMonth);
    console.log('objAccData');
    console.log(objAccData);

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
          visible={this.state.showObjectivesHistory}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Text>
                Objectives accomplished during 
                : {this.state.objectivesPressedMonth.substr(5, 2)}/{this.state.objectivesPressedMonth.substr(0, 4)}
              </Text>
            </CardSection>

            <CardSection style={{ height: 120 }}>
              <FlatList 
                data={this.state.objectivesPressedData}
                renderItem={this.renderObjectivesHistory.bind(this)}
              />
            </CardSection>

            <CardSection>
              <Button onPress={() => this.setState({ showObjectivesHistory: false })}>
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
  const { objAccData } = state.statistics;

  return { objAccData };
};

export default connect(mapStateToProps, {

})(ObjectivesAccomplished);
