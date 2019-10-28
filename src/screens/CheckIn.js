import React, { Component } from 'react';
import { View, AsyncStorage, Picker } from 'react-native';
import { Layout, Text, Input, Button, Spinner } from 'react-native-ui-kitten';
import { connect } from 'react-redux'
import * as actionOrder from './../redux/actions/actionOrder';
import * as actionRoom from './../redux/actions/actionRoom';
import * as actionCustomer from './../redux/actions/actionCustomer'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FlatGrid } from 'react-native-super-grid';
import styles from './../assets/styles/main.styles'

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCheckInDisplay: false,
      inputRoomName: '',
      customers: null,
      customerPicker: null,
      inputDuration: '0',
      roomID: null,
      bookedStatus: false,
      signInData: null
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);

          // this.props.handleGetOrders({
          //   token: result.token
          // }).then(() => {
            // if (this.props.localOrders.isSuccess) {
            //   this.setState({
            //     signInData: result,
            //     customerPicker: this.props.localOrders.orders[0].customerOrder.id
            //   })
            // }
          // })

          this.props.handleGetRooms({
            token: result.token
          })
          .then(() => {
            this.props.handleGetOrders({
              token: result.token
            })
            .then(() => {
              this.props.handleGetCustomers({
                token: result.token
              })
              .then(() =>  {
                if (this.props.localOrders.isSuccess) {
                  console.log(this.props.localOrders.orders);
                  this.setState({
                    signInData: result,
                    customerPicker: (this.props.localCustomers.customers != false) ? this.props.localCustomers.customers[0].id : null 
                  })
                }
              })
            })
          })
        }
      }
    });
  }

  editValueSetter = (params) => {
    params.addCheckInDisplay = true;
    this.setState(params);
  }

  addCheckIn = () => {
    const { roomID, inputDuration, customerPicker } = this.state;
    if (roomID !== null && inputDuration !== '0' && customerPicker !== null) {
      this.props.handleAddCheckIn({
        data: {
          room_id: roomID,
          customer_id: customerPicker,
          duration: inputDuration,
          is_booked: true,
          is_done: false,
          order_end_time: new Date(Date.now()).toISOString()
        },
        token: this.state.signInData.token
      })
    } else {
      alert('duration cannot be empty')
    }
    this.setState({ addCheckInDisplay: false })
  }

  checkOut = () => {
    this.props.handleCheckOut({
      room_id: this.state.roomID,
      token: this.state.signInData.token
    })
    .then(() => {
      this.setState({ addCheckInDisplay: false })
    })
  }

  render() {
    // console.log(this.props.localOrders.orders[2])
    return (
      <Layout style={styles.container}>
        <Modal
          isVisible={this.props.localOrders.isLoading}
          backdropOpacity={0.3}>
          <View style={{ flex: 1 }}>
            <Spinner />
          </View>
        </Modal>
        <Modal
          isVisible={this.state.addCheckInDisplay}
          onBackButtonPress={() => this.setState({ addCheckInDisplay: false })}
          backdropOpacity={0.3}>
          <Layout style={styles.modalBox}>
            <Text style={styles.modalBoxTitle} category="h5">{(this.state.bookedStatus) ? 'Check Out' : 'Check In'}</Text>
            <Layout>
              <Input
                style={styles.modalInput}
                size="small"
                label="Room Name"
                value={this.state.inputRoomName}
                disabled={true}
              />
              <Text
                category="s2"
                appearance="hint"
                style={styles.modalLabel}>
                Customers
                </Text>
              <View style={styles.modalPicker}>
                <Picker
                  selectedValue={this.state.customerPicker}
                  style={styles.pickerItem}
                  onValueChange={(itemValue, ItemIndex) =>
                    this.setState({ customerPicker: itemValue })}>
                  {this.props.localCustomers.customers.map((item, index) =>
                    ((this.props.localCustomers.customers != false)
                      ? <Picker.Item label={`${item.name} - ${item.phone_number}`} value={item.id} />
                      : console.log())
                  )}
                </Picker>
              </View>
              <Input
                style={styles.modalInput}
                size="small"
                label={(this.state.bookedStatus) ? 'Duration Left(minutes)' : 'Duration'}
                value={this.state.inputDuration}
                onChangeText={(text) => this.setState({ inputDuration: text })}
              />  
              <View style={styles.modalBoxBtnContainer}>
                <Button onPress={() => this.setState({ addCheckInDisplay: false })} style={styles.modalBoxBtn}>Cancel</Button>
                <Button onPress={() => (this.state.bookedStatus) ? this.checkOut() : this.addCheckIn()} style={styles.modalBoxBtn}>{(this.state.bookedStatus) ? 'Check Out' : 'Check In'}</Button>
              </View>
            </Layout>
          </Layout>
        </Modal>
        <FlatGrid
          itemDimension={100}
          items={this.props.localRooms.rooms}
          renderItem={({ item, index }) =>
            <View onTouchEndCapture={() => this.editValueSetter({
              inputRoomName: item.name,
              inputDuration: (this.props.localOrders.orders.findIndex(x => x.room_id == item.id) !== -1) ? this.props.localOrders.orders[this.props.localOrders.orders.findIndex(x => x.room_id == item.id)].duration.toString() : '0',
              roomID: item.id,
              bookedStatus: (this.props.localOrders.orders.findIndex(x => x.room_id == item.id) !== -1) ? this.props.localOrders.orders[this.props.localOrders.orders.findIndex(x => x.room_id == item.id)].is_booked : false
            })} style={
              ((this.props.localOrders.orders.findIndex(x => x.room_id == item.id) !== -1)
                ? (this.props.localOrders.orders[this.props.localOrders.orders.findIndex(x => x.room_id == item.id)].is_booked
                  ? [styles.checkinGrid, styles.isBookedTrue]
                  : [styles.checkinGrid, styles.isBookedFalse])
                : [styles.checkinGrid, styles.isBookedFalse])}>
              <Text>{item.name}</Text>
            </View>
          }
        />
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    localOrders: state.orders,
    localRooms: state.rooms,
    localCustomers: state.customers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- Orders ------------//
    handleGetOrders: (params) => dispatch(actionOrder.handleGetOrders(params)),
    handleAddCheckIn: (params) => dispatch(actionOrder.handleAddCheckIn(params)),
    handleCheckOut: (params) => dispatch(actionOrder.handleCheckOut(params)),

    // ----------- Rooms ------------//
    handleGetRooms: (params) => dispatch(actionRoom.handleGetRooms(params)),

    // ----------- Customers -------//
    handleGetCustomers: (params) => dispatch(actionCustomer.handleGetCustomers(params))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckIn);
