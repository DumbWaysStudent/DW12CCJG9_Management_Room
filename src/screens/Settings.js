import React, { Component } from 'react';
import { View, Text, AsyncStorage, RefreshControl } from 'react-native';
import { Layout, Button, List, ListItem, Spinner, Avatar, Input } from 'react-native-ui-kitten';
import { Toast } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './../assets/styles/main.styles';
import * as actionProfile from './../redux/actions/actionProfile';
import { Fab, Card } from 'native-base';
import { connect } from 'react-redux'
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
// import auth from '@react-native-firebase/auth';
// import { firebase } from '@react-native-firebase/storage';


class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInData: null,
      avatar: '',
      imagePic: null,
      name: '',
      email: '',
      editProfileModal: false,
      inputName: '',
      inputEmail: '',
      uploadImage: false,
      isUploadLoading: false
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);

          this.setState({
            signInData: result
          });

          // console.log(this.state.signInData.id)

          this.loadData(result.token);
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
          name: response.fileName,
          path: response.path
        }

        this.setState({
          imagePic: source,
          uploadImage: true
        })
      }
    })
  }

  exitEditModal = () => {
    this.setState({
      editProfileModal: false
    });
  }

  saveEditModal = () => {
    let formData = new FormData();
    formData.append('name', this.state.inputName);
    formData.append('email', this.state.inputEmail);
    formData.append('prevPic', this.props.localProfile.profile.avatar);
    formData.append('avatar_profile', (this.state.imagePic != null) ? this.state.imagePic : this.state.avatar);

    this.props.handleUpdateProfile({
      id: this.props.localProfile.profile.id,
      data: {
        formData
      },
      token: this.state.signInData.token
    })
      .then(() => {
        if (this.props.localProfile.profile.hasOwnProperty('status')) {
          if (this.props.localProfile.profile.status == 'error') {
            Toast.show({
              text: this.props.localProfile.profile.message,
              textStyle: { fontSize: 12, fontWeight: 'bold' },
              duration: 2000,
              style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
            });
          }
        }

        this.loadData(this.state.signInData.token);
      })
      .catch(e => {
        console.log(e)
        Toast.show({
          text: "Error: Can't Edit Profile",
          textStyle: { fontSize: 12, fontWeight: 'bold' },
          duration: 2000,
          style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
        });
      })

    this.setState({
      editProfileModal: false
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

  loadData = (token) => {
    this.props.handleGetProfile({
      id: (this.props.localProfile.profile != false) ? this.props.localProfile.profile.id : this.state.signInData.id,
      token
    })
      .then(() => {
        if (this.props.localProfile.profile.hasOwnProperty('status')) {
          if (this.props.localProfile.profile.status == 'error') {
            Toast.show({
              text: this.props.localProfile.profile.message,
              textStyle: { fontSize: 12, fontWeight: 'bold' },
              duration: 2000,
              style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
            });
          }
        } else {
          this.setState({
            avatar: this.props.localProfile.profile.avatar,
            name: this.props.localProfile.profile.name,
            email: this.props.localProfile.profile.email,
            inputName: this.props.localProfile.profile.name,
            inputEmail: this.props.localProfile.profile.email
          })
        }
      })
      .catch((result) => {
        console.log(result)
        Toast.show({
          text: "Error: Can't load data, please check your internet connection and try again.",
          textStyle: { fontSize: 12, fontWeight: 'bold' },
          duration: 2000,
          style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
        });
      })
  }

  // uploadImage = () => {
  //   if (firebase.apps == false) {
  //     firebase.initializeApp({
  //       projectId: 'smoketoon-bc62e',
  //       apiKey: 'AIzaSyAJSCIPKQwifPAV3ygqKWeE8HP0IJFgnmI',
  //       appId: '1:1061969525441:android:12299dce435407e61db240',
  //       databaseURL: 'https://smoketoon-bc62e.firebaseio.com',
  //       storageBucket: 'smoketoon-bc62e.appspot.com',
  //       messagingSenderId: '1061969525441'
  //     });
  //   }

  //   console.log(firebase.apps)

  //   this.setState({ isUploadLoading: true, editProfileModal: false })
  //   firebase
  //   .auth().signInWithEmailAndPassword('smoketoon@gmail.com', '123456')
  //   .then(result => {
  //     firebase
  //     .app()
  //     .storage()
  //     .ref(`public/${result.user.uid}/profile-image.png`)
  //     .putFile(this.state.imagePic.path)
  //     .then(result => {
  //       this.setState({ isUploadLoading: false })
  //       console.log(result)
  //     })
  //     .catch(err => {
  //       this.setState({ isUploadLoading: false })
  //       console.log(err)
  //     })
  //   })
  //   .catch(err => {
  //     this.setState({ isUploadLoading: false })
  //     console.log(err)
  //   })
  // }

  render() {
    return (
      <Layout style={styles.container} level="4">
        {/* <Modal
          isVisible={this.props.localProfile.isLoading}
          backdropOpacity={0.3}>
          <View style={{ flex: 1, position: 'absolute', top: 220, right: 140 }}>
            <Spinner />
          </View>
        </Modal> */}
        <Modal isVisible={this.state.editProfileModal}>
          <View style={styles.editProfile}>
            <Icon
              style={styles.editProfileExitBtn} name="times-circle"
              onPress={() => {
                this.exitEditModal()
              }} />
            <Avatar style={styles.customerEditAvatar} source={(this.state.avatar != 'default-pic' || this.state.avatar != null) ? { uri: (this.state.uploadImage) ? this.state.imagePic.uri : `http://192.168.0.35:5000/${this.state.avatar}` } : (this.state.imagePic != null) ? { uri: this.state.imagePic.uri } : require('./../assets/images/profile-picture-default.png')} />
            <Icon
              style={styles.editProfileCamera} name="camera"
              onPress={() => this.imagePickerHandler()} />
            <View>
              <Input
                label="E-Mail:"
                style={styles.editProfileInput}
                size="small"
                onChangeText={(text) => this.setState({ inputEmail: text })}
                value={this.state.inputEmail} />
              <Input
                label="Full Name:"
                style={styles.editProfileInput}
                size="small"
                onChangeText={(text) => this.setState({ inputName: text })}
                value={this.state.inputName} />
              <Button
                onPress={() => this.saveEditModal()}
                style={styles.editSaveBtn}>
                Save
                </Button>
            </View>
          </View>
        </Modal>
        <ScrollView
        refreshing={this.props.localProfile.isLoading || this.state.isUploadLoading}
        refreshControl={<RefreshControl colors={['#284de0']} refreshing={this.props.localProfile.isLoading || this.state.isUploadLoading} onRefresh={() => this.loadData(this.state.signInData.token)} />}>
          <Layout level="1" style={{ flexDirection: 'row', padding: 10 }}>
            <Avatar style={styles.customerListAvatar} source={(this.state.avatar != 'default-pic' || this.state.avatar != null) ? { uri: `http://192.168.0.35:5000/${this.state.avatar}` } : require('./../assets/images/profile-picture-default.png')} />
            <Icon name="edit" size={20} style={{ position: 'absolute', right: 0, margin: 8 }} onPress={() => this.setState({ editProfileModal: true })} />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileEmail}>{this.state.email}</Text>
              <Text style={styles.profileName}>{this.state.name}</Text>
            </View>
          </Layout>

          <Layout style={styles.profileItem}>
            <Button onPress={() => this.signOut()}>Sign Out</Button>
          </Layout>
        </ScrollView>
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
    handleGetProfile: (params) => dispatch(actionProfile.handleGetProfile(params)),
    handleUpdateProfile: (params) => dispatch(actionProfile.handleUpdateProfile(params))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
