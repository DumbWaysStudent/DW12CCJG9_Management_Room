import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    AsyncStorage.getItem('signInData', (e, result) => {
        if (!e) {
            console.log(result);
        } else {
            console.log(e)
        }
    })
  }

  render() {
    return (
      <View>
        <Text> CheckIn </Text>
      </View>
    );
  }
}

export default CheckIn;
