import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SpinIcon from '../components/SpinIcon';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <View style={{flex: 1, backgroundColor: '#444', alignItems: 'center'}}>
        <View style={{marginVertical: 250}}>
          {/* <Image style={{width: 150, height: 150}} source={require('../assets/images/logo/smokeLogo.png')} /> */}
          <Text style={{color: '#fff', textAlign: 'center', marginTop: 15, fontFamily: 'KOMIKASL', fontSize: 16}}>SMOKETOON</Text>
        </View>
        <View style={{position: 'absolute', top: 450}}>
        <SpinIcon>
            <Icon name="spinner" size={23} style={{color: "#fff", alignSelf: 'center'}} />
          </SpinIcon>
          </View>
        <Text>Loading....</Text>
    </View>
    );
  }
}

export default Splash;
