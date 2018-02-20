import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

export default class ObjectivesBarItem extends Component {

  render() {
    const { value, color, monthDate } = this.props;
//    const value = 10;
    const unit = 20;
    const barInterval = 5;
    const barItemTop = 16;
    const barWidth = 40;
//    const color = 'blue';
    const barHeight = value * unit;
//    const monthDate = '2017-11';

    return (
      <View style={{ justifyContent: 'flex-end', marginTop: barItemTop }}>
        <Text style={{ alignSelf: 'center' }}>{value}</Text>
        <View 
        style={{ 
          width: barWidth, 
          backgroundColor: color, 
          marginRight: barInterval, 
          height: 1 + barHeight 
        }} 
        />
        <Text style={{ alignSelf: 'center' }}>
          {`${monthDate.substr(5, 2)}/${monthDate.substr(2, 2)}`}
        </Text>
      </View>
    );
  }
}
