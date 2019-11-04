import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Layout, Spinner, Text } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './../assets/styles/main.styles';
import API_URL from './../api_url';
import Axios from 'axios';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  verifyToken = () => {
    Axios
    .get(`https://leaf-hotel.herokuapp.com/api/v2/`)
    .then(result => {
      if (result.data.status == 'errorConn') {
        this.props.navigation.navigate('ErrorConnection');
      } else {
        AsyncStorage.getItem('signInData', (err, res) => {
          if (!err) {
            if (res == null) {
              setTimeout(() => {
                this.props.navigation.navigate('SignIn')
              }, 1000)
            } else {
              res = JSON.parse(res);
              const token = res.token
              if (token) {
    
                // jwt.verify(token, '12378bhdfhdsj783hjsdf237rhjsd', function(err, decoded) {
                //   console.log(err);
                //   if (decoded !== undefined) {
                //     this.props.navigation.navigate('ForYou');
                //   } else {
                //     this.props.navigation.navigate('SignIn');
                //   }
                // });
    
                setTimeout(() => {
                  this.props.navigation.navigate('CheckIn')
                }, 1000)
              } else {
                setTimeout(() => {
                  this.props.navigation.navigate('SignIn')
                }, 1000)
              }
            }
          } else {
            setTimeout(() => {
              this.props.navigation.navigate('SignIn')
            }, 1000)
          }
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      // <View style={{ flex: 1, backgroundColor: '#444', alignItems: 'center' }}>
      //   <View style={{ marginVertical: 250 }}>
      //     {/* <Image style={{width: 150, height: 150}} source={require('../assets/images/logo/smokeLogo.png')} /> */}
      //     <Text style={{ color: '#fff', textAlign: 'center', marginTop: 15, fontFamily: 'KOMIKASL', fontSize: 16 }}>LEAF HOTEL</Text>
      //   </View>
      //   <View style={{ position: 'absolute', top: 450 }}>
      //     <SpinIcon>
      //       <Icon name="spinner" size={23} style={{ color: "#fff", alignSelf: 'center' }} />
      //     </SpinIcon>
      //   </View>
      //   <Text>Loading....</Text>
        // {this.verifyToken()}
      // </View>
      <Layout style={styles.container}>
        <View style={{alignItems: 'center', marginVertical: 200}}>
          <Layout style={[styles.frontHeader, styles.ssHeader]}>
          <Icon name="leaf" size={10} style={{position: 'absolute', top: 6, left: 30}} />
            <Text
              style={styles.signInAppTitle}
              category="h1">
              Leaf Hotel
            </Text>
            <Text
                style={styles.signInAppSubtitle}
                category="c1">
                The Best Choice For You
            </Text>
          </Layout>
          <Spinner />
          {this.verifyToken()} 
        </View>
      </Layout>
    );
  }
}

export default Splash;
