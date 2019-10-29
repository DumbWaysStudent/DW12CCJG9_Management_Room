import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import * as actionCustomer from './../redux/actions/actionCustomer';
import { Layout, Text, Input, Button, Spinner, Avatar } from 'react-native-ui-kitten';
import { Fab, Card, Toast } from 'native-base';
import { connect } from 'react-redux'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FlatGrid } from 'react-native-super-grid';
import styles from './../assets/styles/main.styles';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCustomerModalDisplay: false,
      editCustomerModalDisplay: false,
      inputCustomerName: '',
      inputIdNum: '',
      inputPhoneNum: '',
      inputAvatar: null,
      editModalId: 0,
      avatar: {uri: 'https://i1.wp.com/kiryuu.co/wp-content/uploads/2019/09/Kiryuu-Sampul.png'},
      signInData: null,
      onDelete: false,
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);

          this.setState({
            signInData: result
          });

          this.props.handleGetCustomers({
            token: result.token
          })
          .then(() => {
            if (this.props.localCustomers.customers.hasOwnProperty('status')) {
              if (this.props.localCustomers.customers.status == 'error') {
                Toast.show({
                  text: "Error: Can't Load Data, please check your internet connection and try again",
                  textStyle: { fontSize: 12, fontWeight: 'bold' },
                  duration: 2000,
                  style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
                });
              }
            }
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
          inputAvatar : source,
        })
      }
    })
  }

  addCustomer = () => {
    const { inputCustomerName, inputIdNum, inputPhoneNum, inputAvatar } = this.state;
    let formData = new FormData();
    if (inputCustomerName == '' && inputIdNum == '' && inputPhoneNum == '') {
      Toast.show({
        text: "Error: All Field Except Photos Cannot Be Empty!",
        textStyle: { fontSize: 12, fontWeight: 'bold' },
        duration: 2000,
        style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
      });
    } else {
      formData.append('name', inputCustomerName);
      formData.append('identity_number', inputIdNum);
      formData.append('phone_number', inputPhoneNum);
      formData.append('avatar', inputAvatar);
      this.props.handleAddCustomer({
        data: {
          formData
        },
        token: this.state.signInData.token
      })
      .then(() => {
        this.setState({
          addCustomerModalDisplay: false,
          inputCustomerName: '',
          inputIdNum: '',
          inputPhoneNum: '',
          inputAvatar: null
        })
      })
    }
  }

  editCustomer = () => {
    const { inputCustomerName, inputIdNum, inputPhoneNum, avatar } = this.state;

    if (inputCustomerName == '' && inputIdNum == '' && inputPhoneNum == '') {
      Toast.show({
        text: "Error: All Field Except Photos Cannot Be Empty!",
        textStyle: { fontSize: 12, fontWeight: 'bold' },
        duration: 2000,
        style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
      });
    } else {
      this.props.handleUpdateCustomer({
        data: {
          name: this.state.inputCustomerName,
          identity_number: this.state.inputIdNum,
          phone_number: this.state.inputPhoneNum,
          avatar: this.state.avatar
        },
        id: this.state.editModalId,
        token: this.state.signInData.token
      })
      .then(() => {
        this.setState({
          addCustomerModalDisplay: false,
          inputCustomerName: '',
          inputIdNum: '',
          inputPhoneNum: '',
          inputAvatar: null
        })
      })
    }
  }

  editValueSetter = (params) => {
    params.editCustomerModalDisplay = true;
    this.setState(params);
  }

  deleteCustomer = (id) => {
    this.setState({
      editCustomerModalDisplay: false,
      onDelete: true
    });

    this.props.handleDeleteCustomer({
      id,
      token: this.state.signInData.token
    })
      .then(() => {
        Toast.show({
          text: `Success: Customer Deleted`,
          textStyle: { fontSize: 12, fontWeight: 'bold' },
          duration: 2000,
          style: { backgroundColor: '#00cc00', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
        });

        this.setState({
          addCustomerModalDisplay: false,
          inputCustomerName: '',
          inputIdNum: '',
          inputPhoneNum: '',
          inputAvatar: null
        });
      })
  }

  render() {
    return (
      <Layout style={styles.container}>
        <Modal
          isVisible={this.props.localCustomers.isLoading}
          backdropOpacity={0.3}>
          <View style={{ flex: 1, position: 'absolute', top: 220, right: 140 }}>
            <Spinner />
          </View>
        </Modal>
        <Modal
          isVisible={this.state.addCustomerModalDisplay}
          onBackButtonPress={() => this.setState({
            addCustomerModalDisplay: false,
            inputCustomerName: '',
            inputIdNum: '',
            inputPhoneNum: '',
            inputAvatar: null
          })}
          backdropOpacity={0.3}>
          <Layout style={[styles.modalBox, styles.customerModal]}>
            <Text style={styles.modalBoxTitle} category="h5">Add Customer</Text>
            <Layout>
              <ScrollView>
                <Input
                  style={styles.modalInput}
                  size="small"
                  label="Customer Name"
                  value={this.state.inputCustomerName}
                  onChangeText={(text) => this.setState({ inputCustomerName: text })}
                />

                <Input
                  style={styles.modalInput}
                  size="small"
                  keyboardType="number-pad"
                  label="Identity Number"
                  value={this.state.inputIdNum}
                  onChangeText={(text) => this.setState({ inputIdNum: text })}
                />

                <Input
                  style={styles.modalInput}
                  size="small"
                  keyboardType="phone-pad"
                  label="Phone Number"
                  value={this.state.inputPhoneNum}
                  onChangeText={(text) => this.setState({ inputPhoneNum: text })}
                />

                <View style={{ margin: 8, flexDirection: 'row' }}>
                  <Avatar style={styles.customerListAvatar} source={(this.state.inputAvatar != null) ? {uri: this.state.inputAvatar.uri} : this.state.avatar} /> 
                  <Icon name="camera" size={20} onPress={() => this.imagePickerHandler()} />
                </View>
              </ScrollView>
              <View style={styles.modalBoxBtnContainer}>
                <Button onPress={() => this.setState({
                  addCustomerModalDisplay: false,
                  inputCustomerName: '',
                  inputIdNum: '',
                  inputPhoneNum: '',

                  inputAvatar: null
                })} style={styles.modalBoxBtn}>Cancel</Button>
                <Button onPress={() => this.addCustomer()} style={styles.modalBoxBtn}>Save</Button>
              </View>
            </Layout>
          </Layout>
        </Modal>

        <Modal
          isVisible={this.state.editCustomerModalDisplay}
          onBackButtonPress={() => this.setState({
            editCustomerModalDisplay: false,
            inputCustomerName: '',
            inputIdNum: '',
            inputPhoneNum: '',
            inputAvatar: null
          })}
          backdropOpacity={0.3}>
          <Layout style={[styles.modalBox, styles.customerModal]}>
            <Button onPress={() => this.deleteCustomer(this.state.editModalId)} style={(this.state.onDelete ? [styles.modalTrashBtn, styles.modalTrashBtnOnPress] : styles.modalTrashBtn)}> <Icon size={15} name="trash-alt" />
            </Button>
            <Text style={styles.modalBoxTitle} category="h5">Edit Customer</Text>
            <Layout>
              <ScrollView>
                <Input
                  style={styles.modalInput}
                  size="small"
                  label="Customer Name"
                  value={this.state.inputCustomerName}
                  onChangeText={(text) => this.setState({ inputCustomerName: text })}
                />

                <Input
                  style={styles.modalInput}
                  size="small"
                  label="Identity Number"
                  keyboardType="number-pad"
                  value={this.state.inputIdNum}
                  onChangeText={(text) => this.setState({ inputIdNum: text })}
                />

                <Input
                  style={styles.modalInput}
                  size="small"
                  label="Phone Number"
                  keyboardType="phone-pad"
                  value={this.state.inputPhoneNum}
                  onChangeText={(text) => this.setState({ inputPhoneNum: text })}
                />

                <View style={{ margin: 8, flexDirection: 'row' }}>
                <Avatar style={styles.customerListAvatar} source={this.state.profile_image} />
                  <Icon name="camera" size={20} />
                </View>
              </ScrollView>
              <View style={styles.modalBoxBtnContainer}>
                <Button onPress={() => this.setState({
                  editCustomerModalDisplay: false,
                  inputCustomerName: '',
                  inputIdNum: '',
                  inputPhoneNum: '',
                  inputAvatar: null
                })} style={styles.modalBoxBtn}>Cancel</Button>
                <Button onPress={() => this.editCustomer()} style={styles.modalBoxBtn}>Save</Button>
              </View>
            </Layout>
          </Layout>
        </Modal>
        <FlatGrid
          itemDimension={200}
          items={this.props.localCustomers.customers}
          renderItem={({ item }) =>
            <Card
              onTouchEndCapture={() => this.editValueSetter({
                editModalId: item.id,
                inputCustomerName: item.name,
                inputIdNum: item.identity_number,
                inputPhoneNum: item.phone_number,
                inputAvatar: item.image
              })}
              style={[styles.checkinGrid, styles.customerCard]}>
              {/* <Icon name="user-circle" size={50} style={{ marginVertical: 10, marginRight: 10 }} /> */}
              <Avatar style={styles.customerListAvatar} source={{uri: `http://192.168.0.35:5000/${item.image}`}} />
              <View style={styles.customerListInfo}>
                <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                <Text>{item.identity_number}</Text>
                <Text>{item.phone_number}</Text>
              </View>
            </Card>
          }
        />
        <Fab
          style={{ backgroundColor: '#ffffff', position: 'relative' }}
          position="bottomRight"
          onPress={() => this.setState({ addCustomerModalDisplay: true })}>
          <Icon name="plus" style={{ color: "#284de0" }} />
        </Fab>
      </Layout>
    );
  }
}

// const styles = StyleSheet.create({
//   addCustomerContainer: {
//     marginVertical: 100,
//     marginHorizontal: 35,
//     borderWidth: 2,
//     borderColor: '#444',
//     width: '80%',
//     backgroundColor: '#444',
//     borderRadius: 5
//   }
// })

const mapStateToProps = state => {
  return {
    localCustomers: state.customers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- Customers ------------//
    handleGetCustomers: (params) => dispatch(actionCustomer.handleGetCustomers(params)),
    handleAddCustomer: (params) => dispatch(actionCustomer.handleAddCustomer(params)),
    handleUpdateCustomer: (params) => dispatch(actionCustomer.handleUpdateCustomer(params)),
    handleDeleteCustomer: (params) => dispatch(actionCustomer.handleDeleteRoom(params))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Customer);
