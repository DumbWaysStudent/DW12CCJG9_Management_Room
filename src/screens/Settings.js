import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Layout, Button, List, ListItem, Spinner } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './../assets/styles/main.styles';
import * as actionProfile from './../redux/actions/actionProfile';
import { Fab, Card } from 'native-base';
import { connect } from 'react-redux'
import Modal from 'react-native-modal';


class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInData: null,
      avatar: '',
      name: '',
      email: ''
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);

          this.setState({
            signInData: result
          });

          this.props.handleGetProfile({
            id: result.id,
            token: result.token
          })
            .then(() => {
              this.setState({
                avatar: this.props.localProfile.profile.result.avatar,
                name: this.props.localProfile.profile.result.name,
                email: this.props.localProfile.profile.result.email
              })
            })
        }
      }
    });
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
      <Layout style={styles.container} level="4">
        <Modal
          isVisible={false}
          backdropOpacity={0.3}>
          <View style={{ flex: 1, position: 'absolute', top: 220, right: 140 }}>
            <Spinner />
          </View>
        </Modal>
        <Layout level="1" style={{ flexDirection: 'row', padding: 10, borderRadius: 5 }}>
          <Icon size={60} name="user-circle" />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileEmail}>{this.state.email}</Text>
            <Text style={styles.profileName}>{this.state.name}</Text>
          </View>
        </Layout>

        <Layout style={styles.profileItem}>
          <Button onPress={() => this.signOut()}>Sign Out</Button>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    localProfile: state.profile
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- Profile ------------//
    handleGetProfile: (params) => dispatch(actionProfile.handleGetProfile(params))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
