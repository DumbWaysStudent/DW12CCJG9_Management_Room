import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, AsyncStorage} from 'react-native';
import { Container, Item, Form, Input, Label, Button, Image} from 'native-base';
import Axios from 'axios';
import {API_URL} from './../api_url';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
        inputUsername: '',
        inputPassword: ''
    }
  }

  handleSignIn = () => {
      const verify = this.verifyInput(this.state.inputUsername, this.state.inputPassword);
      
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
            if (result.data.error == true) {
                alert(result.data.message);
            } else {
                // console.log(result.data)
              AsyncStorage
              .setItem('signInData', JSON.stringify(result.data))
              .then(result => {
                  this.props.navigation.navigate('CheckIn');
              })
              .catch(e => {
                  console.log(e);
                  alert('Error Async: cannot sign in');
              })
            }
        })
        .catch(e => {
            console.log(e);
            alert('Error: cannot sign in');
        })
      } else {
          alert(verify.message);
      }
  }

  verifyInput = (username, password) =>   {
      if (username == '' && password == '') {
          return {
              verified: false,
              message: 'password empty'
          }
      } else {
          return {
              verified: true
          }
      }
  }

  render() {
    return (
      <Container style={styles.container}>
          <Item style={styles.authHeader}>
              <Text style={styles.title}>Leaf Hotel</Text>
              <Text style={styles.subTitle}>Sign In using your account</Text>
          </Item>
          <Form>
              <Label>Username:</Label>
              <Item>
                  <Input
                    placeholder="input your username"
                    onChangeText={(text) => this.setState({inputUsername: text})}
                   />
              </Item>
              <Label>Password:</Label>
              <Item>
                  <Input
                    secureTextEntry={true}
                    placeholder="input your password"
                    onChangeText={(text) => this.setState({inputPassword: text})}
                  />
              </Item>
              <Button style={styles.submitBtn} onPress={() => this.handleSignIn()}><Text style={{textAlign: 'center', width: '100%'}}>Sign In</Text></Button>
          </Form>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    authHeader: {
        flexDirection: 'column',
        margin: 5,
    },
    title: {
        fontSize: 16,
    },
    subTitle: {
        fontSize: 12,
    },
    submitBtn: {
        width: '45%',
        fontWeight: 'bold',
        alignSelf: 'center'
    }
});


export default SignIn;