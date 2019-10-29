import React, { Component } from 'react';
import { AsyncStorage, Modal, View} from 'react-native';
import { Toast } from 'native-base';
import { Text, Input, Layout, Button, Spinner } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import {API_URL} from './../api_url';
import styles from '../assets/styles/main.styles';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
        inputUsername: '',
        inputPassword: '',
        secureTextEntry: true,
        isLoading: false
    }
  }

  handleSignIn = () => {
      const verify = this.verifyInput(this.state.inputUsername, this.state.inputPassword);
      this.setState({ isLoading: true});
      if (verify.verified) {
        Axios({
            method: 'post',
            url: `${API_URL}/login`,
            data: {
                username: this.state.inputUsername,
                password: this.state.inputPassword
            }
        })
        .then(result => {
            if (result.data.status == 'error') {
                this.setState({ isLoading: false});
                Toast.show({
                    text: result.data.message,
                    duration: 1000,
                    style: {backgroundColor: '#ff3333'}
                });
            } else {
              AsyncStorage
              .setItem('signInData', JSON.stringify(result.data))
              .then(result => {
                  this.setState({ isLoading: false});
                  this.props.navigation.navigate('CheckIn');
              })
              .catch(e => {
                  this.setState({ isLoading: false});
                  Toast.show({
                    text: 'Error: cannot sign in',
                    duration: 1000,
                    style: {backgroundColor: '#ff3333'}
                });
              })
            }
        })
        .catch(e => {
            this.setState({ isLoading: false});
            Toast.show({
                text: 'Error: cannot sign in',
                duration: 1000,
                style: {backgroundColor: '#ff3333'}
            });
        }) 
      } else {
            this.setState({ isLoading: false});
            Toast.show({
                text: verify.message,
                textStyle: { fontSize: 12, fontWeight: 'bold' },
                duration: 1000,
                style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
            });
      }
  }

  verifyInput = (username, password) =>   {
      if (username == '' && password == '') {
          return {
              verified: false,
              message: 'field is empty'
          }
      } else {
          return {
              verified: true
          }
      }
  }

  onIconPress = () => {
      const secureTextEntry = !this.state.secureTextEntry;
      this.setState({ secureTextEntry })
  }

  renderIcon = () => {
      const iconName = this.state.secureTextEntry ? 'eye-slash' : 'eye';
      return (
          <Icon size={19} name={iconName} />
      );
  }

  render() {
    return (
    <Layout level="4" style={styles.container}>
        <Modal visible={this.state.isLoading} transparent={true}>
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <View style={{margin: 10}}>
                    <Spinner />
                </View>
            </View>
        </Modal>
        <Layout style={styles.frontHeader}>
        <Icon name="leaf" size={8} style={{position: 'absolute', top: 5, left: 125}} />
            <Text
                style={styles.signInAppTitle}
                category="h3">
                Leaf Hotel
            </Text>
            <Text
                style={styles.signInAppSubtitle}
                category="s2">
                Sign In to your account
            </Text>
        </Layout>
        <Layout level="3" style={styles.formContainer}>
            <Input
                style={styles.input}
                value={this.state.inputUsername}
                label="Username"
                placeholder="Place your username here"
                size="small"
                onChangeText={(text) => this.setState({inputUsername: text})}
            />
            <Input
                style={styles.input}
                value={this.state.inputPassword}
                label="Password"
                placeholder="Place your Password here"
                size="small"
                icon={this.renderIcon}
                onIconPress={this.onIconPress}
                secureTextEntry={this.state.secureTextEntry}
                onChangeText={(text) => this.setState({inputPassword: text})}
            />
            <Button disabled={this.state.isLoading} onPress={() => this.handleSignIn()}>Sign In {this.state.loadingIcon}</Button>
        </Layout>
        <Text category="c1" style={styles.ydhaaText} appearance="hint">
            You Don't Have an Account? 
            <Text onPress={() => this.props.navigation.navigate('SignUp')} category="c2" status="info" style={{fontWeight: 'bold'}}> Sign Up Now <Icon name="arrow-right" />  </Text>
        </Text>
    </Layout>
    );
  }
}

export default SignIn;