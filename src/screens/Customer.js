import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import * as actionCustomer from './../redux/actions/actionCustomer';
import { Layout, Text, Input, Button, Spinner } from 'react-native-ui-kitten';
import { Fab, Card, Toast } from 'native-base';
import { connect } from 'react-redux'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FlatGrid } from 'react-native-super-grid';
import styles from './../assets/styles/main.styles';
import { ScrollView } from 'react-native-gesture-handler';

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCustomerModalDisplay: false,
      editCustomerModalDisplay: false,
      inputCustomerName: '',
      inputIdNum: '',
      inputPhoneNum: '',
      editModalId: 0,
      inputImage: 'default-pic',
      signInData: null,
      onDelete: false
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

  addCustomer = () => {
    const { inputCustomerName, inputIdNum, inputPhoneNum, inputImage } = this.state;

    if (inputCustomerName == '' && inputIdNum == '' && inputPhoneNum == '') {
      Toast.show({
        text: "Error: All Field Except Photos Cannot Be Empty!",
        textStyle: { fontSize: 12, fontWeight: 'bold' },
        duration: 2000,
        style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
      });
    } else {
      this.props.handleAddCustomer({
        data: {
          name: this.state.inputCustomerName,
          identity_number: this.state.inputIdNum,
          phone_number: this.state.inputPhoneNum,
          image: this.state.inputImage
        },
        token: this.state.signInData.token
      })
      .then(() => {
        this.setState({
          addCustomerModalDisplay: false,
          inputCustomerName: '',
          inputIdNum: '',
          inputPhoneNum: '',
          inputImage: ''
        })
      })
    }
  }

  editCustomer = () => {
    const { inputCustomerName, inputIdNum, inputPhoneNum, inputImage } = this.state;

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
          image: this.state.inputImage
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
          inputImage: ''
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
          inputImage: ''
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
            inputImage: ''
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
                  label="Identity Number"
                  value={this.state.inputIdNum}
                  onChangeText={(text) => this.setState({ inputIdNum: text })}
                />

                <Input
                  style={styles.modalInput}
                  size="small"
                  label="Phone Number"
                  value={this.state.inputPhoneNum}
                  onChangeText={(text) => this.setState({ inputPhoneNum: text })}
                />

                <View style={{ margin: 8, flexDirection: 'row' }}>
                  <Icon name="user-circle" size={60} />
                  <Icon name="camera" size={20} />
                </View>
              </ScrollView>
              <View style={styles.modalBoxBtnContainer}>
                <Button onPress={() => this.setState({
                  addCustomerModalDisplay: false,
                  inputCustomerName: '',
                  inputIdNum: '',
                  inputPhoneNum: '',
                  inputImage: ''
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
            inputImage: ''
          })}
          backdropOpacity={0.3}>
          <Layout style={[styles.modalBox, styles.customerModal]}>
            <Button onPress={() => this.deleteCustomer(this.state.editModalId)} style={(this.state.onDelete ? [styles.modalTrashBtn, styles.modalTrashBtnOnPress] : styles.modalTrashBtn)}> <Icon size={15} name="trash-alt" />
            </Button>
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
                  label="Identity Number"
                  value={this.state.inputIdNum}
                  onChangeText={(text) => this.setState({ inputIdNum: text })}
                />

                <Input
                  style={styles.modalInput}
                  size="small"
                  label="Phone Number"
                  value={this.state.inputPhoneNum}
                  onChangeText={(text) => this.setState({ inputPhoneNum: text })}
                />

                <View style={{ margin: 8, flexDirection: 'row' }}>
                  <Icon name="user-circle" size={60} />
                  <Icon name="camera" size={20} />
                </View>
              </ScrollView>
              <View style={styles.modalBoxBtnContainer}>
                <Button onPress={() => this.setState({
                  editCustomerModalDisplay: false,
                  inputCustomerName: '',
                  inputIdNum: '',
                  inputPhoneNum: '',
                  inputImage: ''
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
                inputImage: item.image
              })}
              style={[styles.checkinGrid, styles.customerCard]}>
              <Icon name="user-circle" size={50} style={{ marginVertical: 10, marginRight: 10 }} />
              <View>
                <Text>{item.name}</Text>
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
