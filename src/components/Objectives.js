import React, { Component } from 'react';
import _ from 'lodash';
import { 
  Text, 
  Modal, 
  FlatList,
  TouchableOpacity,
  View 
} from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection, Button, Input, ButtonGreen, ButtonRed } from './common';
import {
  filterObjectives,
  addNewObjective,
  deleteCurrentObjective,
  editCurrentObjective,
  accomplishObjective
} from '../actions';

class Objectives extends Component {
  state = {
    showAddObjective: false,
    showDeleteCurrentObjective: false,
    showEditCurrentObjective: false,
    showAccomplishedObjective: false,
    showAccomplishConfirm: false,
    newObjectiveName: '',
    newObjectiveValue: 0,
    newObjectiveCurrentValue: 0,
    pressedObjectiveUid: '',
    pressedObjectiveName: '',
    pressedObjectiveValue: 0,
    pressedObjectiveLatestValue: '',
    pressedObjectiveLatestUpdate: '',
    pressedObjectiveReachedDate: '',
    pressedObjectiveValueHistory: []
  };

  componentWillMount() {
    this.props.filterObjectives(this.props.objectives);
  }

  onAcceptAddObjective() {
    this.props.addNewObjective(
      this.state.newObjectiveName,
      this.state.newObjectiveValue
    );
    this.setState({ 
      showAddObjective: false,
      newObjectiveName: '',
      newObjectiveValue: 0
     });
  }

  onAcceptEditCurrentObjective() {
    this.props.editCurrentObjective(
      this.state.newObjectiveCurrentValue,
      this.state.pressedObjectiveUid,
      this.props.currentObjectives
    );
    this.setState({ showEditCurrentObjective: false });
  }

  onAccomplishedObjectivePress({ item }) {
    let subDate = '';
    let historyDate = '';
    const valueHistory = [];

    item.accomplishedDate !== undefined ?
    subDate = `${item.accomplishedDate.substr(8, 2)}/${item.accomplishedDate.substr(5, 2)}/${item.accomplishedDate.substr(0, 4)}` :
    subDate = '';

    item.valueHistory !== undefined ?
    Object.keys(item.valueHistory).forEach(key => {
      historyDate = `${item.valueHistory[key].date.substr(8, 2)}/${item.valueHistory[key].date.substr(5, 2)}/${item.valueHistory[key].date.substr(0, 4)}`;
      valueHistory.push({ 
        uid: key, 
        datedValue: item.valueHistory[key].datedValue, 
        date: historyDate
      });
    }) :
    null;

    this.setState({
      pressedObjectiveUid: item.uid,
      pressedObjectiveName: item.objectiveName,
      pressedObjectiveValue: item.objectiveValue,
      pressedObjectiveAccomplishedDate: subDate,
      pressedObjectiveValueHistory: valueHistory,
      showAccomplishedObjective: true
    });
  }

  onAcceptAccomplish() {
    this.props.accomplishObjective(
      this.state.pressedObjectiveUid,
      this.props.currentObjectives,
      this.props.accomplishedObjectives
    );
    this.setState({ showAccomplishConfirm: false });
  }

  onAcceptDeleteCurrentObjective() {
    this.props.deleteCurrentObjective(this.state.pressedObjectiveUid);
    this.setState({ showDeleteCurrentObjective: false });
  }

  onDecline() {
    this.setState({ 
      showAddObjective: false,
      showDeleteCurrentObjective: false,
      showEditCurrentObjective: false,
      showAccomplishedObjective: false,
      showAccomplishConfirm: false
    });
  }

  onObjectiveNameChange(name) {
    this.setState({ newObjectiveName: name });
  }

  onObjectiveValueChange(value) {
    this.setState({ newObjectiveValue: parseFloat(value.replace(',', '.')) });
  }

  onObjectiveCurrentValueEdit(value) {
    this.setState({ newObjectiveCurrentValue: parseFloat(value.replace(',', '.')) });
  }

  onCurrentObjectivePress({ item }) {
    let lastUpdate = '';
    let historyDate = '';
    const valueHistory = [];

    item.valueHistory !== undefined ?
    Object.keys(item.valueHistory).forEach(key => {
      historyDate = `${item.valueHistory[key].date.substr(8, 2)}/${item.valueHistory[key].date.substr(5, 2)}/${item.valueHistory[key].date.substr(0, 4)}`;
      valueHistory.push({ 
        uid: key, 
        datedValue: item.valueHistory[key].datedValue, 
        date: historyDate
      });
    }) :
    null;

    this.setState({
      pressedObjectiveUid: item.uid,
      pressedObjectiveName: item.objectiveName,
      pressedObjectiveValue: item.objectiveValue,
      pressedObjectiveValueHistory: valueHistory
    }); 

    item.currentValue !== undefined && item.lastUpdate !== undefined ?
    (lastUpdate = `${item.lastUpdate.substr(8, 2)}/${item.lastUpdate.substr(5, 2)}/${item.lastUpdate.substr(0, 4)}`,
    this.setState({
      pressedObjectiveLatestValue: item.currentValue,
      pressedObjectiveLatestUpdate: lastUpdate,
    })) :
    this.setState({
      pressedObjectiveLatestValue: '',
      pressedObjectiveLatestUpdate: '',
    });

    this.setState({ showEditCurrentObjective: true });    
  }

  onCurrentObjectiveLongPress({ item }) {
    this.setState({ 
      pressedObjectiveUid: item.uid,
      pressedObjectiveName: item.objectiveName,
      pressedObjectiveValue: item.objectiveValue,
      showDeleteCurrentObjective: true 
    });
  }

  onAccomplishPress() {
    this.setState({ showEditCurrentObjective: false });
    setTimeout(() => {
      this.setState({ showAccomplishConfirm: true });
    }, 100);
  }

  renderCurrentObjectives({ item }) {
    return (
      <TouchableOpacity 
        onPress={() => this.onCurrentObjectivePress({ item })}
        onLongPress={() => this.onCurrentObjectiveLongPress({ item })}
      >
        <View>
          <CardSection>
            <Text style={{ flex: 2 }}>
              {item.objectiveName}
            </Text>
            <Text style={{ flex: 1 }}>
              Goal: {item.objectiveValue}
            </Text>
            <Text style={{ flex: 1 }}>
              Current: {item.currentValue}
            </Text>
          </CardSection>
        </View>
      </TouchableOpacity>
    );
  }

  renderAccomplishedObjectives({ item }) {
    let subDate = '';
    item.accomplishedDate !== undefined ? 
    subDate = `${item.accomplishedDate.substr(8, 2)}/${item.accomplishedDate.substr(5, 2)}/${item.accomplishedDate.substr(0, 4)}` : 
    null;

    return (
      <TouchableOpacity 
        onPress={() => this.onAccomplishedObjectivePress({ item })}
      >
        <View>
          <CardSection>
            <Text style={{ flex: 1 }}>
              {item.objectiveName}
            </Text>
            <Text style={{ flex: 1 }}>
              Goal: {item.objectiveValue}
            </Text>
            <Text style={{ flex: 1 }}>
              Date: {subDate}
            </Text>
          </CardSection>
        </View>
      </TouchableOpacity>
    );
  }

  renderValueHistory({ item }) {
    return (
      <View>
        <CardSection>
          <Text style={{ flex: 1 }}>
            Value: {item.datedValue}
          </Text>
          <Text style={{ flex: 1 }}>
            Date: {item.date}
          </Text>
        </CardSection>
      </View>
    );
  }

  render() {
    console.log('props and state / RENDER');
    console.log(this.props);
    console.log(this.state);
    return (
      <Card>
        <CardSection style={{ flexDirection: 'column', height: 220 }}>
          <Text style={styles.listHeaderTextStyle}>Current Objectives</Text>
          <Text style={styles.listSubTextStyle}>Press to edit - LongPress to delete</Text>
          <FlatList
            data={this.props.currentObjectives}
            renderItem={this.renderCurrentObjectives.bind(this)}
            extraData={this.state}
          />
        </CardSection>

        <CardSection>
            <Button onPress={() => this.setState({ showAddObjective: true })}>
              Add Objective
            </Button>
        </CardSection>

        <CardSection style={{ flexDirection: 'column', height: 200 }}>
          <Text style={styles.listHeaderTextStyle}>Accomplished</Text>
          <Text style={styles.listSubTextStyle}>Press to see details</Text>
          <FlatList
            data={_.orderBy(this.props.accomplishedObjectives, ['accomplishedDate'])}
            renderItem={this.renderAccomplishedObjectives.bind(this)}
            extraData={this.state}
          />
        </CardSection>

{/* Popup to Add a new Objective*/}
        <Modal
          visible={this.state.showAddObjective}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>Enter details for your new objective.</Text>
              <Text>Give it a name and a value you want to reach.</Text>
            </CardSection>
            <CardSection>
              <Input 
                label="Name"
                placeholder="Bench Press - Max 1 Rep (kg)"
                onChangeText={this.onObjectiveNameChange.bind(this)}
              />
            </CardSection>
            <CardSection>
              <Input 
                label="Value"
                placeholder="100"
                onChangeText={this.onObjectiveValueChange.bind(this)}
                keyboardType='numeric'
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptAddObjective.bind(this)}>
                Add
              </Button>

              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to edit a current Objective*/}
        <Modal
          visible={this.state.showEditCurrentObjective}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>Name: {this.state.pressedObjectiveName}</Text>
              <Text>Goal: {this.state.pressedObjectiveValue}</Text>
              <Text>Latest Value: {this.state.pressedObjectiveLatestValue}</Text>
              <Text>Updated on: {this.state.pressedObjectiveLatestUpdate}</Text>
            </CardSection>

            <CardSection>
              <Input 
                label="Current Value:"
                placeholder="100"
                onChangeText={this.onObjectiveCurrentValueEdit.bind(this)}
                keyboardType='numeric'
              />
            </CardSection>
            <CardSection style={{ flexDirection: 'column', height: 150 }}>
              <Text style={styles.listHeaderTextStyle}>History</Text>
              <Text style={styles.listSubTextStyle}>(updated on app restart)</Text>
              <FlatList
              data={_.orderBy(this.state.pressedObjectiveValueHistory, ['date'])}
              renderItem={this.renderValueHistory.bind(this)}
              />
            </CardSection>
            <CardSection>
              <ButtonGreen onPress={this.onAccomplishPress.bind(this)}>
                Objective Accomplished
              </ButtonGreen>
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptEditCurrentObjective.bind(this)}>
                Update
              </Button>

              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to confirm an Objective is Accomplished */}
        <Modal
          visible={this.state.showAccomplishConfirm}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>Is the objective {this.state.pressedObjectiveName} accomplished ?</Text>
              <Text>You won't be able to edit or delete this objective anymore</Text>
            </CardSection>

            <CardSection>
              <ButtonGreen onPress={this.onAcceptAccomplish.bind(this)}>
                Confirm
              </ButtonGreen>

              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to Delete a Current Objective */}
        <Modal
          visible={this.state.showDeleteCurrentObjective}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>Do you want to delete {this.state.pressedObjectiveName} ?</Text>
              <Text>This action cannot be undone </Text>
            </CardSection>

            <CardSection>
              <ButtonRed onPress={this.onAcceptDeleteCurrentObjective.bind(this)}>
                Delete
              </ButtonRed>

              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to See Details of an Accomplished Objective */}
        <Modal
          visible={this.state.showAccomplishedObjective}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>Name: {this.state.pressedObjectiveName}</Text>
              <Text>Goal: {this.state.pressedObjectiveValue}</Text>
              <Text>Accomplished on: {this.state.pressedObjectiveAccomplishedDate}</Text>
            </CardSection>
            <CardSection style={{ flexDirection: 'column', height: 150 }}>
              <Text style={styles.listHeaderTextStyle}>History</Text>
              <Text style={styles.listSubTextStyle}>(updated on app restart)</Text>
              <FlatList
              data={_.orderBy(this.state.pressedObjectiveValueHistory, ['date'])}
              renderItem={this.renderValueHistory.bind(this)}
              />
            </CardSection>

            <CardSection>
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

const mapStateToProps = ({ profile }) => {
  const { currentObjectives, accomplishedObjectives, objectives } = profile;

  return { currentObjectives, accomplishedObjectives, objectives };
};

export default connect(mapStateToProps, { 
  filterObjectives, 
  addNewObjective,
  deleteCurrentObjective,
  editCurrentObjective,
  accomplishObjective
})(Objectives);
