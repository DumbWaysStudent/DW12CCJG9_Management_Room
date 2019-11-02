import React, { Component } from 'react';
// import { View } from 'react-native';
import styles from './../assets/styles/main.styles';
import {Layout, Text, Button} from 'react-native-ui-kitten';
import RNExitApp from 'react-native-exit-app';

class ErrorConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  exitApp = () => {
    RNExitApp.exitApp();
  }

  tryAgain = () => {
    this.props.navigation.navigate('Splash', {tryAgain: true});
  }

  render() {
    return (
      <Layout style={styles.eConnContainer} level="1">
      <Layout style={styles.eConnSubContainer}>
        <Text style={styles.eConnText} category="h3"> Error!</Text>
        <Text style={styles.eConnSubText} category="s1">Can't connect to databse, please check your internet connection. If the problem appear again tell the developer.</Text>
      </Layout>
      <Layout style={styles.eConnDialogBtn}>
        <Button style={[styles.dialogBtn, styles.exitBtn]} onPress={() => this.exitApp()}>Exit</Button>
        <Button style={[styles.dialogBtn, styles.tryAgainBtn]} onPress={() => this.tryAgain()}>Try Again</Button>
      </Layout>
      </Layout>
    );
  }
}

export default ErrorConnection;
