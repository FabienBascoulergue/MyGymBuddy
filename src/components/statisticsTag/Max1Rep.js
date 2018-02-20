import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  View,
  Text,
  Modal
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { CardSection, Button, Input } from '../common';
import {
  updateMax
} from '../../actions';

class Max1Rep extends Component {
  state = {
    bench: new Animated.Value(0),
    squat: new Animated.Value(0),
    deadlift: new Animated.Value(0),
    date: new Date().toJSON().substr(0, 16),
    newMaxBench: 0,
    newMaxSquat: 0,
    newMaxDeadlift: 0,
    showUpdateMaxConfirm: false,
    showUpdateMax: false,
    index: this.props.dataHistory.length - 1
  }

  componentWillMount() {
    console.log('ComponentWillMount/Max1Rep');

    const width = this.getWidth(this.props.dataHistory[this.state.index]);
    console.log('width');
    console.log(width);
    this.setState({
      bench: new Animated.Value(width.maxBench),
      squat: new Animated.Value(width.maxSquat),
      deadlift: new Animated.Value(width.maxDeadlift),
      date: width.date
    });
  }

  onMaxBenchChange(value) {
    this.setState({ newMaxBench: parseFloat(value.replace(',', '.')) });
  }

  onMaxSquatChange(value) {
    this.setState({ newMaxSquat: parseFloat(value.replace(',', '.')) });
  }

  onMaxDeadliftChange(value) {
    this.setState({ newMaxDeadlift: parseFloat(value.replace(',', '.')) });
  }

  onUpdateMax() {
    this.setState({ showUpdateMax: false });
    setTimeout(() => {
      this.setState({ showUpdateMaxConfirm: true });
    }, 100);
  }

  onUpdateMaxConfirm() {
    let maxBench;
    let maxSquat;
    let maxDeadlift;
    const { dataHistory } = this.props;

    (this.state.newMaxBench === 0 || 
    this.state.newMaxBench === this.props.maxBench || 
    isNaN(this.state.newMaxBench)) ?
    maxBench = this.props.maxBench :
    maxBench = this.state.newMaxBench;

    (this.state.newMaxSquat === 0 || 
    this.state.newMaxSquat === this.props.maxSquat || 
    isNaN(this.state.newMaxSquat)) ?
    maxSquat = this.props.maxSquat :
    maxSquat = this.state.newMaxSquat;

    (this.state.newMaxDeadlift === 0 ||
    this.state.newMaxDeadlift === this.props.maxDeadlift || 
    isNaN(this.state.newMaxDeadlift)) ?
    maxDeadlift = this.props.maxDeadlift :
    maxDeadlift = this.state.newMaxDeadlift;

    
    this.props.updateMax(maxBench, maxSquat, maxDeadlift, dataHistory);
    const newIndex = this.props.dataHistory.length - 1;
    this.setState({ 
      showUpdateMaxConfirm: false,
      index: newIndex,
      date: dataHistory[newIndex].date.substr(0, 16)
    }); 
    
    this.handleAnimation(dataHistory[newIndex]);
  }

  onDecline() {
    this.setState({ showUpdateMax: false });
    this.setState({ showUpdateMaxConfirm: false });
  }

  onLeftChevronPress() {
    const { index } = this.state;
    const { dataHistory } = this.props;
    const newDate = dataHistory[index - 1].date;
    this.handleAnimation(dataHistory[index - 1]);

    this.setState({
      index: index - 1,
      date: newDate
    });
  }

  onRightChevronPress() {
    const { index } = this.state;
    const { dataHistory } = this.props;
    const newDate = dataHistory[index + 1].date;
    this.handleAnimation(dataHistory[index + 1]);

    this.setState({
      index: index + 1,
      date: newDate
    });
  }

  getWidth(data) {
    const deviceWidth = Dimensions.get('window').width;
    const indicators = ['maxBench', 'maxSquat', 'maxDeadlift'];
    const unit = {
      maxBenchUnit: 1,
      maxSquatUnit: 1,
      maxDeadliftUnit: 1
    };
    const width = {};
    let widthCap; // Give with a max cap
    indicators.forEach(item => {
      /* React-Native bug: if width=0 at first time, the borderRadius can't be implemented in the View */
      widthCap = data[item] * unit[`${item}Unit`] || 5;
      width[item] = widthCap <= (deviceWidth - 75) ? widthCap : (deviceWidth - 75);
    });
    width.date = data.date;

    return width;
  }

  handleAnimation(data) {
    console.log('handleAnimation');

    const timing = Animated.timing;
    const width = this.getWidth(data);
    const newValue = {
      bench: width.maxBench,
      squat: width.maxSquat,
      deadlift: width.maxDeadlift
    };
    const indicators = ['bench', 'squat', 'deadlift'];
    Animated.parallel(indicators.map(item => {
      return timing(this.state[item], { toValue: newValue[item], duration: 1000 });
    })).start();
  }

  render() {
    const { maxBench, maxSquat, maxDeadlift } = this.props;
    const { bench, squat, deadlift } = this.state;

    console.log('Props/State/ Render Max2Rep');
    console.log(this.props);
    console.log(this.state);
   
    return (
      <View>
        <Text>Bench Press</Text>
        <View style={{ flexDirection: 'row' }}>
          <Animated.View style={[styles.bar, styles.bench, { width: bench }]} />
          <Text>
            {this.props.dataHistory[this.state.index].maxBench} kg 
            { 
              this.props.dataHistory[this.state.index].maxBench - maxBench > 0 ?
              `(+${this.props.dataHistory[this.state.index].maxBench - maxBench})` :
              `(${this.props.dataHistory[this.state.index].maxBench - maxBench})`
            }
          </Text>
        </View>

        <Text>Squat</Text>
        <View style={{ flexDirection: 'row' }}>
          <Animated.View style={[styles.bar, styles.squat, { width: squat }]} />
          <Text>
            {this.props.dataHistory[this.state.index].maxSquat} kg 
            { 
              this.props.dataHistory[this.state.index].maxSquat - maxSquat > 0 ?
              `(+${this.props.dataHistory[this.state.index].maxSquat - maxSquat})` :
              `(${this.props.dataHistory[this.state.index].maxSquat - maxSquat})`
            }
          </Text>
        </View>
        
        <Text>Deadlift</Text>
        <View style={{ flexDirection: 'row' }}>
          <Animated.View style={[styles.bar, styles.deadlift, { width: deadlift }]} />
          <Text>
            {this.props.dataHistory[this.state.index].maxDeadlift} kg  
            { 
              this.props.dataHistory[this.state.index].maxDeadlift - maxDeadlift > 0 ?
              `(+${this.props.dataHistory[this.state.index].maxDeadlift - maxDeadlift})` :
              `(${this.props.dataHistory[this.state.index].maxDeadlift - maxDeadlift})`
            }
          </Text>
        </View>

        <CardSection style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 10 }}>
          {
            this.state.index > 0 ?
            <Icon 
            name='chevron-left' 
            size={35}
            onPress={() => this.onLeftChevronPress()}
            /> :
            null
          }
          
          <Text style={{ fontSize: 22 }}>
            {`${this.state.date.substr(8, 2)}-${this.state.date.substr(5, 2)}-${this.state.date.substr(0, 4)} ${this.state.date.substr(11, 5)}`}
          </Text>

          {
            this.state.index < this.props.dataHistory.length - 1 ?
            <Icon 
            name='chevron-right'
            size={35}
            onPress={() => this.onRightChevronPress()} 
            /> :
            null
          }
          
        </CardSection>
        <CardSection style={{ borderBottomWidth: 0 }}>
          <Button onPress={() => this.setState({ showUpdateMax: true })}>
            Update my Max
          </Button>
        </CardSection>

{/* Popup to Update Max 1 Rep */}
        <Modal
          visible={this.state.showUpdateMax}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>Enter your new Max 1 Rep for one or any of the 3 exercises</Text>
            </CardSection>
            <CardSection>
              <Input 
                label="Bench Press:"
                placeholder="0"
                onChangeText={this.onMaxBenchChange.bind(this)}
                keyboardType='numeric'
              />
            </CardSection>
            <CardSection>
              <Input 
                label="Squat:"
                placeholder="0"
                onChangeText={this.onMaxSquatChange.bind(this)}
                keyboardType='numeric'
              />
            </CardSection>
            <CardSection>
              <Input 
                label="Deadlift:"
                placeholder="0"
                onChangeText={this.onMaxDeadliftChange.bind(this)}
                keyboardType='numeric'
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onUpdateMax.bind(this)}>
                Update
              </Button>

              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to Confirm the Update Max 1 Rep */}
        <Modal
          visible={this.state.showUpdateMaxConfirm}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>Your new Max 1 Rep will be updated as follow:</Text>
              <Text style={{ paddingTop: 20 }}>
                Bench Press: 
                { 
                  (this.state.newMaxBench === 0 || 
                  this.state.newMaxBench === this.props.maxBench || 
                  isNaN(this.state.newMaxBench)) ?
                  ` ${this.props.maxBench} kg (unchanged)` :
                  ` ${this.state.newMaxBench} kg (new value)`
                }
              </Text>
              <Text>
                Squat: 
                { 
                  (this.state.newMaxSquat === 0 || 
                  this.state.newMaxSquat === this.props.maxSquat || 
                  isNaN(this.state.newMaxSquat)) ?
                  ` ${this.props.maxSquat} kg (unchanged)` :
                  ` ${this.state.newMaxSquat} kg (new value)`
                }
              </Text>
              <Text>
                Deadlift: 
                { 
                  (this.state.newMaxDeadlift === 0 || 
                  this.state.newMaxDeadlift === this.props.maxDeadlift || 
                  isNaN(this.state.newMaxDeadlift)) ?
                  ` ${this.props.maxDeadlift} kg (unchanged)` :
                  ` ${this.state.newMaxDeadlift} kg (new value)`
                }
              </Text>
            </CardSection>

            <CardSection>
              <Button onPress={this.onUpdateMaxConfirm.bind(this)}>
                Confirm
              </Button>

              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>        
      </View>
    );
  }
}

const styles = {
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 8,
    marginRight: 5
  },
  bench: {
    backgroundColor: 'crimson'
  },
  squat: {
    backgroundColor: 'goldenrod'
  },
  deadlift: {
    backgroundColor: 'dodgerblue'
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  }
};

const mapStateToProps = (state) => {
  const { maxBench, maxSquat, maxDeadlift, dataHistory } = state.statistics;

  return { maxBench, maxSquat, maxDeadlift, dataHistory };
};

export default connect(mapStateToProps, { 
  updateMax 
})(Max1Rep);
