import React, { Component } from 'react';
import { Text, View, Modal } from 'react-native';
import { connect } from 'react-redux';
import { 
  emailChanged,
  passwordChanged, 
  createEmailChanged, 
  createPasswordChanged, 
  createUser,
  loginUser 
} from '../actions';
import { Card, CardSection, Input, Button, Spinner } from './common';

class LoginForm extends Component {
  state = { showModal: false };

  onEmailChange(text) {
    this.props.emailChanged(text);
  }
 
  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onCreateEmailChange(text) {
    this.props.createEmailChanged(text);
  }
 
  onCreatePasswordChange(text) {
    this.props.createPasswordChanged(text);
  }  

  onButtonPress() {
    const { email, password } = this.props;
    this.props.loginUser({ email, password });
  }

  onDecline() {
    this.setState({ showModal: false });
  }

  onAccept() {
    const { createemail, createpassword } = this.props;
    this.props.createUser({ createemail, createpassword });
    this.setState({ showModal: false });
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
            Login
      </Button>
    );
  }
  

  render() {
    return (
      <Card>
        <CardSection>
          <Input 
            label="Email"
            placeholder="email@gmail.com"
            onChangeText={this.onEmailChange.bind(this)}
            value={this.props.email}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label="Password"
            placeholder="password"
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.password}
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>
          {this.props.error}
        </Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>

        <CardSection>
          <Button onPress={() => this.setState({ showModal: !this.state.showModal })}>
            Sign up
          </Button>
        </CardSection>

        <Modal
          visible={this.state.showModal}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.containerStyle}>
            <CardSection>
              <Input 
                label="Email"
                placeholder="email@gmail.com"
                onChangeText={this.onCreateEmailChange.bind(this)}
                value={this.props.createemail}
              />
            </CardSection>
    
            <CardSection>
              <Input
                secureTextEntry
                label="Password"
                placeholder="password"
                onChangeText={this.onCreatePasswordChange.bind(this)}
                value={this.props.createpassword}
              />
            </CardSection>
    
            <CardSection>
              <Button onPress={this.onAccept.bind(this)}>Create my account</Button>
              <Button onPress={this.onDecline.bind(this)}>Cancel</Button>
            </CardSection>
          </View>
        </Modal>
        
      </Card>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  }
};

const mapStateToProps = ({ auth }) => {
  const { email, password, createemail, createpassword, error, loading } = auth;

  return { email, password, createemail, createpassword, error, loading };
};

export default connect(mapStateToProps, {
  emailChanged, passwordChanged, createEmailChanged, createPasswordChanged, loginUser, createUser 
})(LoginForm);
