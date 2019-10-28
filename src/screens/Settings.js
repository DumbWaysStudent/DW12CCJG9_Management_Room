import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import {Button} from 'react-native-ui-kitten';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  signOut = () => {
      AsyncStorage
      .clear()
      .then(() => {
          this.props.navigation.navigate('SignIn');
      })
      .catch(e => {
          console.log(e);
          alert('Error: Cannot Sign Out');
      })
  }

  render() {
    return (
      <View>
        <Text> Settings </Text>
        <Button onPress={() => this.signOut()}>Sign Out</Button>
      </View>
    );
  }
}

export default Settings;
