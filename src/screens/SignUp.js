import React, { Component } from 'react';
import { AsyncStorage, Modal, View, BackHandler } from 'react-native';
import { Text, Input, Layout, Button, Spinner } from 'react-native-ui-kitten';
import { Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import { API_URL } from './../api_url';
import styles from '../assets/styles/main.styles';
import { ScrollView } from 'react-native-gesture-handler';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputUsername: '',
      inputPassword: '',
      inputFullName: '',
      inputEmail: '',
      secureTextEntry: true,
      isLoading: false
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }

  handleSignIn = () => {
    const verify = this.verifyInput({
      username: this.state.inputUsername,
      password: this.state.inputPassword,
      fullName: this.state.inputFullName,
      email: this.state.inputEmail
    });

    this.setState({ isLoading: true });
    if (verify.verified) {
      Axios({
        method: 'post',
        url: `${API_URL}/register`,
        data: {
          username: this.state.inputUsername,
          password: this.state.inputPassword,
          name: this.state.inputFullName,
          email: this.state.inputEmail
        }
      })
        .then(result => {
          if (result.data.status == 'error') {
            this.setState({ isLoading: false });
            Toast.show({
              text: result.data.message,
              duration: 500,
              style: styles.signIntoastError
            });
          } else {
            AsyncStorage
              .setItem('signInData', JSON.stringify(result.data))
              .then(result => {
                this.setState({ isLoading: false });
                this.props.navigation.navigate('CheckIn');
              })
              .catch(e => {
                this.setState({ isLoading: false });
                Toast.show({
                  text: 'Error: cannot sign up',
                  duration: 500,
                  style: styles.signIntoastError
                });
              })
          }
        })
        .catch(e => {
          this.setState({ isLoading: false });
          console.log(e);
          Toast.show({
            text: 'Error: cannot sign up',
            duration: 500,
            style: styles.signIntoastError
          });
        })
    } else {
      this.setState({ isLoading: false });
      Toast.show({
        text: verify.message,
        duration: 500,
        style: styles.signIntoastError
      });
    }
  }

  verifyInput = (params) => {
    if (params.username == '' && params.password == '' && params.fullName == '' && params.email == '') {
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
      <Layout level="4" style={[styles.container, styles.containerFront]}>
        <ScrollView>
          <Modal visible={this.state.isLoading} transparent={true}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <View style={{ margin: 10 }}>
                <Spinner />
              </View>
            </View>
          </Modal>
          <Layout style={[styles.frontHeader]}>
            <Text
              style={styles.signInAppTitle}
              category="h4">
              Sign Up
            </Text>
            <Text
              style={styles.signInAppSubtitle}
              category="s2">
              Sign Up an Account
            </Text>
          </Layout>
          <Layout level="3" style={[styles.formContainer, styles.signUp]}>
            <Input
              style={styles.input}
              value={this.state.inputFullName}
              label="Full Name"
              placeholder="Place your full name here"
              size="small"
              onChangeText={(text) => this.setState({ inputFullName: text })}
            />

            <Input
              style={styles.input}
              value={this.state.inputUsername}
              label="Username"
              placeholder="Place your username here"
              size="small"
              onChangeText={(text) => this.setState({ inputUsername: text })}
            />

            <Input
              style={styles.input}
              value={this.state.inputEmail}
              keyboardType="email-address"
              label="E-Mail"
              placeholder="Place your email here"
              size="small"
              onChangeText={(text) => this.setState({ inputEmail: text })}
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
              onChangeText={(text) => this.setState({ inputPassword: text })}
            />
            <Button disabled={this.state.isLoading} onPress={() => this.handleSignIn()}>Sign Up {this.state.loadingIcon}</Button>
          </Layout>
          <Text category="c1" style={styles.ydhaaText} appearance="hint">
            You Have an Account?
            <Text onPress={() => this.props.navigation.goBack()} category="c2" status="info" style={{ fontWeight: 'bold' }}>  Sign In</Text>
          </Text>
        </ScrollView>
      </Layout>
    );
  }
}

export default SignUp;
