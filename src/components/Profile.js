import React, { Component } from 'react';
import { 
  Text, 
  Image, 
  View, 
  TouchableOpacity, 
  Modal,
  CameraRoll,
  Alert,
  NativeModules
 } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
// import RNFetchBlob from 'react-native-fetch-blob'; iOs Link problem
import CameraRollPicker from 'react-native-camera-roll-picker';
import { Card, CardSection, Button, ButtonSmall, Input } from './common';
import {
  heightChanged,
  weightChanged,
  descriptionChanged,
  profileNameChanged,
  profilePictureChanged,
  saveProfileChanges
} from '../actions';

class Profile extends Component {
  state = {
    showChangeProfileName: false,
    showChangeHeight: false,
    showChangeWeight: false,
    showChangeProfilePicture: false,
    showChangeDescription: false,
    newProfileName: '',
    newHeight: '',
    newWeight: '',
    newDescription: '',
    newProfilePicture: { uri: '' },
    selectedPicture: []
  }

  onHeightChange(text) {
    this.setState({ newHeight: text });
  }
 
  onWeightChange(text) {
    this.setState({ newWeight: text });
  }

  onProfileNameChange(text) {
    this.setState({ newProfileName: text });
  }
  
  onDescriptionChange(text) {
    this.setState({ newDescription: text });
  }

  onAcceptChangeHeight() {
    this.props.heightChanged(this.state.newHeight);
    this.setState({ showChangeHeight: false });
  }

  onAcceptChangeWeight() {
    this.props.weightChanged(this.state.newWeight);
    this.setState({ showChangeWeight: false });
  }

  onAcceptChangeName() {
    this.props.profileNameChanged(this.state.newProfileName);
    this.setState({ showChangeProfileName: false });
  }

  onAcceptChangeDescription() {
    this.props.descriptionChanged(this.state.newDescription);
    this.setState({ showChangeDescription: false });
  }

  onDecline() {
    this.setState({ showChangeProfileName: false });
    this.setState({ showChangeWeight: false });
    this.setState({ showChangeHeight: false });
    this.setState({ showChangeProfilePicture: false });
    this.setState({ showChangeDescription: false });
    console.log('Console.log(props/state) onDecline');
    console.log(this.props);
    console.log(this.state);
  }

  onAcceptChangeProfilePicture() {
    console.log('this.state/changeProfilePicture');
    console.log(this.state);
    console.log(NativeModules);
    this.props.profilePictureChanged(this.state.newProfilePicture.uri);
    this.setState({ showChangeProfilePicture: false });
  }  

  getSelectedImage(image, current) {
    this.setState({
      selected: image,
      newProfilePicture: current
    });
  }

  saveChanges() {
    const { profileName, height, weight, description, pictureUri } = this.props;
    this.props.saveProfileChanges({ profileName, height, weight, description, pictureUri });
  }

  render() {
    console.log(this.props);
    return (
      <Card>
        <CardSection 
          style={{ 
            flexDirection: 'column', 
            justifyContent: 'center', 
            paddingTop: 20, 
            alignItems: 'center',
            paddingBottom: 10 }}
        >
          {
          this.props.pictureUri ?
          <Image 
            style={{ width: 100, height: 100, resizeMode: Image.resizeMode.stretch }} 
            source={{ uri: this.props.pictureUri }} 
          /> :       
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAACiCAMAAABhyk/bAAAAY1BMVEX///8zMzPKysr+/v6tra3b29vW1tbx8fE6Ojr19fX6+vpjY2NZWVnn5+fu7u5NTU2Hh4d7e3tvb29BQUGfn5+VlZW3t7fDw8Pi4uI4ODh0dHRqampQUFBGRkaOjo68vLypqamW1li4AAAEMUlEQVR4nO2cbXeiMBBGjRtRFEVRqbZF/f+/cqXd3foCyTzPQOSczf3cA/ckJJmZjB2Nh8to/Guo1G6jYRLdOKIbR3TjiG4c0Y0junFEN47oxhHdOKIbR3TjiG4c/4nbMrHWnnbWnpNuntiRW7IvKnNDtinTQbgtd5/mmWPx9nK36WnWYPY9ejo7tdtl22ZWs1i+zi19d5ld2SqGTue2bPrQHti9xm2Z+9WM2b/CbSUYNc3IadwKmZox4+BuO6maqbjVyrtNxGrGFIHdFoCboXYS2u0NUTOfzDtoN2jYuIFj3ZCvrWYR0G0DuplJMLe0NfZo4xTMrUTVTB7MDZ5SY5JQbpXf5RH8VOXc0FVa8xHIzRJuM/g1nNuacDOHMG7gofBNGcYN3t1q4PiXclsxamYTxC2h3OAjlXI7U27wyUC5XSi3WRC3PeVm0OoN5XYasBu19RqDZluUGxGFDN0NDX0pN1/x6JVuQ55Tci1MQ7hx+9sRfQ3lhmcyNVkQNyYkDxWHzKn47RLETV4VvAXO7Dk3eVnwhwp+S7gccB3IbZThbnjRl3TDJ7XC30K6LWE34paBrb/Bxz1RKmfdxqAavPEq3NDUHq9wKdywgXtnXhHofoGo9oa6l8H3XZ0bEGFu0ahS7TZ13obfYrkXaO4opWURvJqqdxPmNFu2n0DlNhXdidPdBLpegokgAL7QT1f2YPizGm776MLNGywVioer+2rcuWqm6ZjS9yO5inHZSvPkDvq42iusC12fWRc9ZueW1bqZ657bSW/eoSm1mcH3ML24jea7p6ErNN1lXbpdk5v1nd1C2zNY010v6HT38UcsXzMR+DNqt7n92SfSpLR2fDOZVjWx2r7BS+U4lZLrWqWi8W9Ubqt9HV4eWy9tvya5oCdY4fbv82/r0iqVC4N2m9wElufGv0h/miEyaq8j3ZK76mDVmKvc5Tq5xQ8J7m73w9zTlBo/JtcVbEe4JQ0V1ec5Wz23t6B2sFuT2fXwfFyM88a0H5tZ0K3ZrB6Th0itLbHOrfxtkNvBUXW7DyMd0XAuXrOAW7o/tr/RmM+b88l9Mb0QnhVyt9LXu5X//eZSb069FgXEUreJoKR1XNdDl5aCjHorKZEI3aQ3f9W7tLqf+VunZG5k04WTrferE7lxvSo+mk860C0VF9owfLVziVsfM/qFJ7ITuE2p21IJnvZ8gRvTXCnEnU4I3KgGRhnuvlq/G9ckKMPdXuB345oahDgn1e9GNqrIcMYkfjfhD504nFuc163Pz+0aWKncsN/FwLhidK8b024B4DrwvW5kP5kU12LwuvW489ZcNG7ErygQXD+j8bnN+1VzbiI+t0PPbq6LfJ8b19YuxxUm+dx63t6czfn/yf9M6JzoxhHdOKIbR3TjiG4c0Y0junFEN47oxhHdOKIbR3Tj+HIbKle34fIbREU3UDHNKp0AAAAASUVORK5CYII=' }}
          />
          }
          <View style={{ width: 125, flexDirection: 'row', paddingTop: 20 }}>
            <ButtonSmall 
              style={{ alignSelf: 'center' }}
              onPress={() => this.setState({ showChangeProfilePicture: true })}
            >
              Change Profile Picture
            </ButtonSmall>
          </View>

          <View style={{ flexDirection: 'row', paddingTop: 20 }}>
            <Text style={{ flex: 3, fontSize: 16, alignSelf: 'center', paddingLeft: 10 }}>
              Name:   {this.props.profileName}
            </Text>
            <ButtonSmall 
              style={{ flex: 1, alignSelf: 'center' }}
              onPress={() => this.setState({ showChangeProfileName: true })}
            >
              Change Name
            </ButtonSmall>
          </View>

          <View style={{ flexDirection: 'row', paddingTop: 40, paddingLeft: 10 }}>
            <Text style={{ flex: 3, fontSize: 16, alignSelf: 'center' }}>
              Height (cm):   {this.props.height}
            </Text>
            <ButtonSmall 
              style={{ flex: 1, alignSelf: 'center' }}
              onPress={() => this.setState({ showChangeHeight: true })}
            >
              Modify
            </ButtonSmall>
          </View>

          <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 10 }}>
            <Text style={{ flex: 3, fontSize: 16, alignSelf: 'center' }}>
              Weight (kg): {this.props.weight}
            </Text>
            <ButtonSmall 
              style={{ flex: 1, alignSelf: 'center' }}
              onPress={() => this.setState({ showChangeWeight: true })}
            >
              Modify
            </ButtonSmall>
          </View>

          <View style={{ flexDirection: 'row', paddingTop: 15, paddingLeft: 10 }}>
            <Text style={{ flex: 3, fontSize: 16, alignSelf: 'center' }}>
              Description:
            </Text>
            <ButtonSmall 
              style={{ flex: 1, alignSelf: 'center' }}
              onPress={() => this.setState({ showChangeDescription: true })}
            >
              Modify
            </ButtonSmall>
          </View>
          <View style={{ paddingLeft: 20, alignSelf: 'flex-start', maxHeight: 100 }}>
            <Text style={{ fontSize: 12 }}>
              {this.props.description}
            </Text>
          </View>
        </CardSection>

        <CardSection>
          <Button onPress={() => Actions.objectives()}>
            My Objectives
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.saveChanges.bind(this)}>
            Save Changes
          </Button>
        </CardSection>

{/* Popup to change Name*/}
        <Modal
          visible={this.state.showChangeProfileName}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Input 
              label="New name"
              placeholder="New name"
              onChangeText={this.onProfileNameChange.bind(this)}
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptChangeName.bind(this)}>Change Name</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>

          </View>
        </Modal>

{/* Popup to change Height*/}
        <Modal
          visible={this.state.showChangeHeight}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Input 
                label="Height (cm)"
                placeholder="180"
                onChangeText={this.onHeightChange.bind(this)}
                keyboardType='numeric'
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptChangeHeight.bind(this)}>Change Height</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>
          </View>
        </Modal>

{/* Popup to change Weight*/}
        <Modal
          visible={this.state.showChangeWeight}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Input
                label="Weight (kg)"
                placeholder="80"
                onChangeText={this.onWeightChange.bind(this)}
                keyboardType='numeric'
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptChangeWeight.bind(this)}>Change Weight</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>
          </View>
        </Modal>

{/* Popup to change Description*/}
        <Modal
          visible={this.state.showChangeDescription}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Input
                label="Description:"
                placeholder="Things about me"
                onChangeText={this.onDescriptionChange.bind(this)}
                multiline
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptChangeDescription.bind(this)}>Change Description</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>
          </View>
        </Modal>

{/* Popup to change Profile Picture*/}
        <Modal
          visible={this.state.showChangeProfilePicture}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection style={{ height: 350 }}>
              <CameraRollPicker
                scrollRenderAheadDistance={500}
                initialListSize={1}
                pageSize={3}
                removeClippedSubviews
                groupTypes='SavedPhotos'
                batchSize={5}
                maximum={1}
                selectSingleItem
                selected={this.state.selected}
                assetType='Photos'
                imagesPerRow={3}
                imageMargin={5}
                callback={this.getSelectedImage.bind(this)} 
              />
            </CardSection>

            <CardSection>
              <Button onPress={this.onAcceptChangeProfilePicture.bind(this)}>Change Picture</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>
          </View>
        </Modal>
      </Card>
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

const mapStateToProps = ({ profile }) => {
  const { profileName, height, weight, description, pictureUri } = profile;

  return { profileName, height, weight, description, pictureUri };
};

export default connect(mapStateToProps, {
  heightChanged,
  weightChanged,
  descriptionChanged,
  profileNameChanged,
  profilePictureChanged,
  saveProfileChanges
})(Profile);
