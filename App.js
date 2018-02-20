import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './src/reducers';
import Router from './src/Router';

class App extends Component {
  componentWillMount() {
    const config = {
      apiKey: 'AIzaSyDzzspvfLRdiV3Z7RgxV1j1n71H89dlaqc',
      authDomain: 'mygymbuddy-b72e5.firebaseapp.com',
      databaseURL: 'https://mygymbuddy-b72e5.firebaseio.com',
      projectId: 'mygymbuddy-b72e5',
      storageBucket: 'mygymbuddy-b72e5.appspot.com',
      messagingSenderId: '821189504690'
    };

    firebase.initializeApp(config);
  }
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}


export default App;
