import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Layout, Button, List, ListItem, Spinner, Avatar } from 'react-native-ui-kitten';
import ImagePicker from 'react-native-image-picker';
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
      imagePic: null,
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

  imagePickerHandler() {
    const options = {
      title: 'Select Avatar',
      customButton: [{
        name: 'fb',
        title: 'Choose Photo From Facebook'
      }],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response =', response);

      if (response.didCancel) {
        console.log('User Cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        const source = {
          uri: response.uri,
          type: response.type,
          name: response.fileName
        }

        this.setState({
          imagePic: source,
        })
      }
    })
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
          isVisible={this.props.localProfile.isLoading}
          backdropOpacity={0.3}>
          <View style={{ flex: 1, position: 'absolute', top: 220, right: 140 }}>
            <Spinner />
          </View>
        </Modal>
        <Layout level="1" style={{ flexDirection: 'row', padding: 10, borderRadius: 5 }}>
        <Avatar style={styles.customerListAvatar} source={(this.state.avatar != 'default-pic') ? {uri: `http://192.168.0.35:5000/${this.state.avatar}`} : (this.state.imagePic != null) ? {uri: this.state.imagePic.uri} : ''} />
        <Icon name="edit" size={20} style={{position: 'absolute', right: 0, margin: 8}}/>
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
