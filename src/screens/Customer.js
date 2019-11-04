import React, { Component } from 'react';
import { View, AsyncStorage, RefreshControl } from 'react-native';
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
      avatar: require('./../assets/images/profile-picture-default.png'),
      prevPic: '',
      signInData: null,
      onDelete: false,
      searchFilterData: [],
      searchStatus: false
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);

          this.setState({
            signInData: result
          });

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
      console.log('Response =', response);

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
          inputAvatar: source,
        })
      }
    })
  }

  addCustomer = () => {
    const { inputCustomerName, inputIdNum, inputPhoneNum, inputAvatar } = this.state;
    let formData = new FormData();
    if (inputCustomerName == '' && inputIdNum == '' && inputPhoneNum == '') {
      this.toastGenerator('error', "Error: All Field Except Photos Cannot Be Empty!")
    } else {
      formData.append('name', inputCustomerName);
      formData.append('identity_number', inputIdNum);
      formData.append('phone_number', inputPhoneNum);
      formData.append('avatar_customer', inputAvatar);
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

      this.setState({
        addCustomerModalDisplay: false,
      })
    }
  }

  editCustomer = () => {
    const { inputCustomerName, inputIdNum, inputPhoneNum, inputAvatar } = this.state;
    if (inputCustomerName == '' && inputIdNum == '' && inputPhoneNum == '') {
      this.toastGenerator('error', "Error: All Field Except Photos Cannot Be Empty!")
    } else {
      let formData = new FormData();

      formData.append('name', inputCustomerName);
      formData.append('identity_number', inputIdNum);
      formData.append('phone_number', inputPhoneNum);
      formData.append('prevPic', this.state.prevPic);
      formData.append('avatar_customer', inputAvatar);
      this.props.handleUpdateCustomer({
        data: {
          formData
        },
        id: this.state.editModalId,
        token: this.state.signInData.token
      })
        .then(() => {
          this.setState({
            inputCustomerName: '',
            inputIdNum: '',
            inputPhoneNum: '',
            inputAvatar: null
          })
        })

      this.setState({
        editCustomerModalDisplay: false,
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
      token: this.state.signInData.token,
      prevPic: this.state.inputAvatar
    })

    this.setState({
      addCustomerModalDisplay: false,
      inputCustomerName: '',
      inputIdNum: '',
      inputPhoneNum: '',
      inputAvatar: null
    });
  }

  loadData = (token) => {
    this.props.handleGetCustomers({
      token
    })
      .then(() => {
        if (this.props.localCustomers.customers.hasOwnProperty('status')) {
          if (this.props.localCustomers.customers.status == 'error') {
            this.toastGenerator('error', this.props.localCustomers.customers.message)
          }
        }
      })
      .catch(() => {
        this.toastGenerator('error', "Error: Can't load data, please check your internet connection and try again.")
      })
  }

  toastGenerator = (type = 'error', message) => {
    Toast.show({
      text: message,
      textStyle: { fontSize: 12, fontWeight: 'bold' },
      duration: 500,
      style: (type == 'error') ? [styles.toastStyle, styles.errorToast] : [styles.toastStyle, styles.successToast]
    });
  }

  searchFilter(text) {
    console.log(text)
    if (text != '') {
      this.setState({
        searchStatus: true
      })
    } else {
      this.setState({
        searchStatus: false
      })
    }
    const newData = this.props.localCustomers.customers.result.filter(item => {
      const itemData = `${item.name.toUpperCase()}`

      const textData = text.toUpperCase();
      console.log(itemData.indexOf(textData))
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      searchFilterData: newData
    })
  }

  renderSearchIcon = () => {
    return (
      <Icon size={19} name="search" />
    );
  }

  render() {
    return (
      <Layout style={styles.container}>
        <Layout style={styles.searchBar}>
          <Input
            onChangeText={text => this.searchFilter(text)}
            icon={this.renderSearchIcon}
            placeholder="Search Customer...."
            size="small" />
        </Layout>
        {/* <Modal
          isVisible={this.props.localCustomers.isLoading}
          backdropOpacity={0.3}>
          <View style={{ flex: 1, position: 'absolute', top: 220, right: 140 }}>
            <Spinner />
          </View>
        </Modal> */}
        <Modal
          onBackdropPress={() => this.setState({
            addCustomerModalDisplay: false,
            inputCustomerName: '',
            inputIdNum: '',
            inputPhoneNum: '',
            inputAvatar: null
          })}
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
                  <Avatar style={styles.customerListAvatar} source={(this.state.inputAvatar !== null && this.state.inputAvatar.hasOwnProperty('uri')) ? { uri: this.state.inputAvatar.uri } : this.state.avatar } />
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
          onBackdropPress={() => this.setState({
            editCustomerModalDisplay: false,
            inputCustomerName: '',
            inputIdNum: '',
            inputPhoneNum: '',
            inputAvatar: null
          })}
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
                  <Avatar style={styles.customerListAvatar} source={(this.state.inputAvatar !== null && this.state.inputAvatar.hasOwnProperty('uri') == true) ? { uri: this.state.inputAvatar.uri } : { uri: `https://leaf-hotel.herokuapp.com/ ${this.state.inputAvatar}` }} />
                  <Icon name="camera" size={20} onPress={() => this.imagePickerHandler()} />
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
          refreshing={this.props.localCustomers.isLoading}
          refreshControl={<RefreshControl colors={['#284de0']} refreshing={this.props.localCustomers.isLoading} onRefresh={() => this.loadData(this.state.signInData.token)} />}
          itemDimension={200}
          items={(this.state.searchStatus) ? this.state.searchFilterData : this.props.localCustomers.customers.result}
          renderItem={({ item }) =>
            <Card
              onTouchEndCapture={() => this.editValueSetter({
                editModalId: item.id,
                inputCustomerName: item.name,
                inputIdNum: item.identity_number,
                inputPhoneNum: item.phone_number,
                inputAvatar: item.image,
                prevPic: item.image
              })}
              style={[styles.customerCard]}>
              {/* <Icon name="user-circle" size={50} style={{ marginVertical: 10, marginRight: 10 }} /> */}
              <Avatar style={styles.customerListAvatar} source={{ uri: `https://leaf-hotel.herokuapp.com/${item.image}` }} />
              <View style={styles.customerListInfo}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text>{item.identity_number}</Text>
                <Text>{item.phone_number}</Text>
              </View>
            </Card>
          }
        />
        <Fab
          style={{ backgroundColor: '#ffffff', position: 'relative' }}
          position="bottomRight"
          onPress={() => this.setState({
            addCustomerModalDisplay: true,
            inputCustomerName: '',
            inputIdNum: '',
            inputPhoneNum: '',
            inputAvatar: null
          })}>
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
