import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

export default class ScoreBarItem extends Component {

  render() {
    const { valueW1, valueW2, valueW3, valueW4, valueMonth, monthDate } = this.props;
    const unit = 0.001;
    const barItemTop = 16;
    const barWidth = 30;
    const opacityTop = 0.1;
    const colorBot = 'blue';
    const colorTop = 'red';
//    const monthDate = '2017-11';

    return (
      <View style={{ justifyContent: 'flex-end', marginTop: barItemTop, marginRight: 5 }}>
        <Text style={{ alignSelf: 'center' }}>{valueMonth}</Text>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <View 
            style={{ 
              width: barWidth, 
              backgroundColor: colorTop,
              height: (valueMonth - valueW1) * unit,
              opacity: opacityTop
            }} 
            />
            <View 
            style={{ 
              width: barWidth, 
              backgroundColor: colorBot,
              height: valueW1 * unit
            }} 
            />
            <Text style={{ alignSelf: 'center' }}>W1</Text>
          </View>
          
          <View>
            <View 
            style={{ 
              width: barWidth, 
              backgroundColor: colorTop,
              height: (valueMonth - valueW2) * unit,
              opacity: opacityTop
            }} 
            />
            <View 
            style={{ 
              width: barWidth, 
              backgroundColor: colorBot,
              height: valueW2 * unit
            }} 
            />
            <Text style={{ alignSelf: 'center' }}>W2</Text>
          </View>

          <View>
            <View 
            style={{ 
              width: barWidth, 
              backgroundColor: colorTop,
              height: (valueMonth - valueW3) * unit,
              opacity: opacityTop
            }} 
            />
            <View 
            style={{ 
              width: barWidth, 
              backgroundColor: colorBot,
              height: valueW3 * unit
            }} 
            />
            <Text style={{ alignSelf: 'center' }}>W3</Text>
          </View>

          <View>
            <View 
            style={{ 
              width: barWidth, 
              backgroundColor: colorTop,
              height: (valueMonth - valueW4) * unit,
              opacity: opacityTop
            }} 
            />
            <View 
            style={{ 
              width: barWidth, 
              backgroundColor: colorBot,
              height: valueW4 * unit
            }} 
            />
            <Text style={{ alignSelf: 'center' }}>W4</Text>
          </View>
          
        </View>
        <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>
          {`${monthDate.substr(5, 2)}/${monthDate.substr(2, 2)}`}
        </Text>
      </View>
    );
  }
}
