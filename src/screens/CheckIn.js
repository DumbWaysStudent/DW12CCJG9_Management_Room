import React, { Component } from 'react';
import { View, AsyncStorage, Picker, RefreshControl } from 'react-native';
import { Layout, Text, Input, Button, Spinner } from 'react-native-ui-kitten';
import { Toast } from 'native-base';
import { connect } from 'react-redux'
import * as actionOrder from './../redux/actions/actionOrder';
import * as actionRoom from './../redux/actions/actionRoom';
import * as actionCustomer from './../redux/actions/actionCustomer'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FlatGrid } from 'react-native-super-grid';
import styles from './../assets/styles/main.styles'
import moment from 'moment';

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCheckInDisplay: false,
      inputRoomName: '',
      customers: null,
      customerPicker: null,
      inputDuration: '',
      durationLeft: '0',
      roomID: null,
      bookedStatus: false,
      signInData: null,
      orders_end_time: [],
      searchFilterData: [],
      searchStatus: false,
      interval: null,
      refreshing: false
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);
          this.setState({
            signInData: result
          })

          // this.props.handleGetOrders({
          //   token: result.token
          // }).then(() => {
          // if (this.props.localOrders.isSuccess) {
          //   this.setState({
          //     signInData: result,
          //     customerPicker: this.props.localOrders.orders.result[0].customerOrder.id
          //   })
          // }
          // })

          this.loadData(result.token);

        } else {
          this.toastGenerator('error', "Error: Can't load data.")
        }
      } else {
        this.toastGenerator('error', "Error: Can't load data.")
      }
    });
  }

  setCheckOutTimer = () => {
    if (this.props.localOrders.orders.result != undefined && this.props.localOrders.orders.result != false) {
      let order_end_time = this.props.localOrders.orders.result[0].order_end_time;
      let timeLeft = ''
      let matches = null;

      timeLeft = moment(new Date(order_end_time)).diff(moment(), 'minute');
      // matches = moment(new Date(order_end_time)).fromNow().match(/(\d+)/g);

      // if (matches !== null && timeLeft.search('ago') === -1) {
      //   timeLeft = matches[0];
      // } else {
      //   timeLeft = '0';
      // }
      // console.log(timeLeft);

      if (timeLeft == '0') {
        clearInterval(this.state.interval);
        let id = this.props.localOrders.orders.result[0].id;
        console.log(id)

        const findSpecificRoom = (data) => {
          return this.props.localRooms.rooms.result[this.props.localRooms.rooms.result.findIndex(x => x.id == data.room_id)];
        }

        this.editValueSetter({
          inputRoomName: findSpecificRoom(this.props.localOrders.orders.result[0]).name,
          inputDuration: '',
          roomID: findSpecificRoom(this.props.localOrders.orders.result[0]).id,
          customerPicker: (this.props.localOrders.orders.result.findIndex(x => x.room_id == findSpecificRoom(this.props.localOrders.orders.result[0]).id) !== -1)
            ? this.props.localOrders.orders.result[this.props.localOrders.orders.result.findIndex(x => x.room_id == findSpecificRoom(this.props.localOrders.orders.result[0]).id)].customer_id : 0,
          durationLeft: this.durationLeftSetter(this.props.localOrders.orders, findSpecificRoom(this.props.localOrders.orders.result[0])),
          bookedStatus: (this.props.localOrders.orders.result.findIndex(x => x.room_id == findSpecificRoom(this.props.localOrders.orders.result[0]).id) !== -1)
            ? this.props.localOrders.orders.result[this.props.localOrders.orders.result.findIndex(x => x.room_id == findSpecificRoom(this.props.localOrders.orders.result[0]).id)].is_booked : false
        }, false);

        this.checkOut();

        // this.setState({ addCheckInDisplay: true });

      }
    }
  }

  editValueSetter = (params, modalDisplay) => {
    if (params.hasOwnProperty('customerPicker') && this.props.localCustomers.customers.result != undefined && this.props.localCustomers.customers.result != false) {
      params.customerPicker = this.props.localCustomers.customers.result[0].id;
    } else if (params.hasOwnProperty('customerPicker') && this.props.localCustomers.customers.result == undefined || this.props.localCustomers.customers.result == false) {
      params.customerPicker = null
    }
    params.addCheckInDisplay = modalDisplay;
    this.setState(params);
  }

  addCheckIn = () => {
    const { roomID, inputDuration, customerPicker } = this.state;

    if (roomID !== null && inputDuration !== '' && customerPicker != null) {
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
        .then(() => {
          if (this.props.localOrders.orders.status == 'error') {
            this.toastGenerator('error', "Error: Add Check In Failed");
          } else {
            this.setState({
              inputRoomName: '',
              inputDuration: '',
              roomID: null,
              durationLeft: '0',
              bookedStatus: false
            })
            this.toastGenerator('success', "Add Checkin Success");
          }
        })
      this.setState({
        addCheckInDisplay: false,
      })
    } else {
      this.toastGenerator('error', "Error: customer not found and duration cannot be empty");
    }
  }

  checkOut = () => {
    if (this.state.roomID != null && this.state.signInData != null) {
      this.setState({ addCheckInDisplay: false })

      // let data = this.props.localOrders.orders.result[this.props.localOrders.orders.result.findIndex(x => x.room_id == this.state.roomID)];
      // data.duration = moment(new Date(data.order_end_time)).diff(moment(), 'minute');
      // data.is_done = true;
      // data.created_by = this.state.signInData.id;
      // console.log(data)

      let data = {
        room_name: this.getKeyValue(this.props.localRooms.rooms.result, 'id', this.state.roomID, 'name'),
        customer_name: this.getKeyValue(this.props.localCustomers.customers.result, 'id', this.state.customerPicker, 'name'),
        identity_number: this.getKeyValue(this.props.localCustomers.customers.result, 'id', this.state.customerPicker, 'identity_number'),
        phone_number: this.getKeyValue(this.props.localCustomers.customers.result, 'id', this.state.customerPicker, 'phone_number'),
        duration: this.getKeyValue(this.props.localOrders.orders.result, 'room_id', this.state.roomID, 'duration'),
        order_end_time: this.getKeyValue(this.props.localOrders.orders.result, 'room_id', this.state.roomID, 'order_end_time'),
        is_done: true
      }

      console.log(data)
      
      this.props.handleCheckOut({
        data,
        room_id: this.state.roomID,
        token: this.state.signInData.token
      })
        .then(() => {
          if (this.props.localOrders.orders.status == 'error') {
            this.toastGenerator('error', "Error: Can't Checkout")
          } else {
            this.setState({
              interval: setInterval(this.setCheckOutTimer, 5000)
            })
            this.toastGenerator('success', "Checkout Success");
          }
        })
    }
  }

  /**
   * Get key value from array of object
   */
  getKeyValue = (obj, keyToCompare, dataToCompare, keyToGet) => {
    if (obj != undefined && obj != false) {
      if (obj.findIndex(x => x[keyToCompare] == dataToCompare) !== -1) {
        return obj[obj.findIndex(x => x[keyToCompare] == dataToCompare)][keyToGet];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  durationSetter = (data, dataToCompare) => {
    if (data.result != null && data.result != false) {
      let index = data.result.findIndex(x => x.room_id == dataToCompare.id);
      if (index !== -1) {
        return (data.result[index].duration + 1).toString();
      } else {
        return '0';
      }
    } else {
      return '0'
    }
  }

  durationLeftSetter = (data, dataToCompare) => {
    let matches, durationLeft;
    if (data.result != null && data.result != false) {
      let index = data.result.findIndex(x => x.room_id == dataToCompare.id);
      if (index !== -1) {
        durationLeft = moment(new Date(data.result[index].order_end_time)).diff(moment(), 'minute');
        // matches = durationLeft.match(/(\d+)/g);
        return durationLeft.toString()
      } else {
        return '0';
      }
    } else {
      return '0'
    }
  }

  loadData = (token) => {
    this.props.handleGetRooms({
      token
    })
      .then(() => {
        const rooms = this.props.localRooms.rooms;
        if (rooms.hasOwnProperty('status')) {
          if (rooms.status === 'success') {
            this.props.handleGetOrders({
              token
            })
              .then(() => {
                const orders = this.props.localOrders.orders;
                if (orders.hasOwnProperty('status')) {
                  if (orders.status === 'success') {
                    this.props.handleGetCustomers({
                      token
                    })
                      .then(() => {
                        const customers = this.props.localCustomers.customers;
                        if (customers.hasOwnProperty('status')) {
                          if (customers.status == 'success') {
                            this.setState({
                              interval: setInterval(this.setCheckOutTimer, 5000),
                              customerPicker: (this.props.localCustomers.customers.result != false) ? this.props.localCustomers.customers.result[0].id : null
                            })
                          } else if (customers.status == 'error') {
                            this.toastGenerator('error', customers.message);
                          }
                        } else {
                          this.toastGenerator('error', "Error: Can't load data, please check your internet connection and try again.");
                        }
                      })
                      .catch((e) => {
                        console.log(e)
                        this.toastGenerator('error', "Error: Can't load data, please check your internet connection and try again.");
                      })
                    // ------------------------- Customers ------------------------------------ //
                  } else if (orders.status === 'error') {
                    this.toastGenerator('error', orders.message);
                  }
                } else {
                  this.toastGenerator('error', "Error: Can't load data, please check your internet connection and try again.");
                }
              })
              .catch((e) => {
                this.toastGenerator('error', "Error: Can't load data, please check your internet connection and try again.");
              })
            // -------------------------------- Orders --------------------------------------- //
          } else if (rooms.status === 'error') {
            this.toastGenerator('error', rooms.message);
          }
        } else {
          this.toastGenerator('error', "Error: Can't load data, please check your internet connection and try again.");
        }
      })
      .catch((e) => {
        this.toastGenerator('error', "Error: Can't load data, please check your internet connection and try again.")
      })
    // -------------------------------------- Rooms ----------------------------------------- //
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
    if (text != '') {
      this.setState({
        searchStatus: true
      })
    } else {
      this.setState({
        searchStatus: false
      })
    }
    const newData = this.props.localRooms.rooms.result.filter(item => {
      const itemData = `${item.name.toUpperCase()}`

      const textData = text.toUpperCase()

      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      searchFilterData: newData
    })
  }

  checkOrder = (type, roomID) => {
    const orders = this.props.localOrders.orders;
    if (type == 'grid') {
      if (orders.result != undefined && orders.result != false) {
        if (this.props.localOrders.orders.result.findIndex(x => x.room_id == roomID) !== -1) {
          if (this.props.localOrders.orders.result[this.props.localOrders.orders.result.findIndex(x => x.room_id == roomID)].is_booked) {
            return [styles.checkinGrid, styles.isBookedTrue];
          } else {
            return [styles.checkinGrid, styles.isBookedFalse];
          }
        } else {
          return [styles.checkinGrid, styles.isBookedFalse];
        }
      } else {
        return [styles.checkinGrid, styles.isBookedFalse]
      }
    } else if (type == 'gridText') {
      if (orders.result != undefined && orders.result != false) {
        if (this.props.localOrders.orders.result.findIndex(x => x.room_id == roomID) !== -1) {
          if (this.props.localOrders.orders.result[this.props.localOrders.orders.result.findIndex(x => x.room_id == roomID)].is_booked) {
            return [styles.gridTextName, styles.gridTextNameIsBookedTrue];
          } else {
            return [styles.gridTextName, styles.gridTextNameIsBookedFalse];
          }
        } else {
          return [styles.gridTextName, styles.gridTextNameIsBookedFalse]
        }
      } else {
        return [styles.gridTextName, styles.gridTextNameIsBookedFalse]
      }
    }
  }

  orderStatus = (roomID) => {
    const orders = this.props.localOrders.orders;
    if (orders.result != undefined && orders.result != false) {
      if (this.props.localOrders.orders.result.findIndex(x => x.room_id == roomID) !== -1) {
        if (this.props.localOrders.orders.result[this.props.localOrders.orders.result.findIndex(x => x.room_id == roomID)].is_booked) {
          return moment(new Date(this.props.localOrders.orders.result[this.props.localOrders.orders.result.findIndex(x => x.room_id == roomID)].order_end_time)).diff(moment(), 'minute') + ' minute left';
        } else {
          return 'Avaible'
        }
      } else {
        return 'Avaible';
      }
    } else {
      return 'Avaible';
    }
  }

  findSpecificKey = (obj, targetID, keyToGet) => {
    if (obj.result != undefined && obj.result != false) {
      if (obj.result.findIndex(x => x.room_id == targetID) !== -1) {
        return obj.result[obj.result.findIndex(x => x.room_id == targetID)][keyToGet];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  renderSearchIcon = () => {
    return (
      <Icon style={{ fontSize: 20 }} name="search" />
    );
  }

  render() {
    return (
      <Layout style={styles.container}>
        {/* <Modal
          isVisible={this.props.localRooms.isLoading}
          swipeThreshold={1}
          backdropOpacity={0.3}>
          <View style={{ flex: 1, position: 'absolute', top: 220, right: 140 }}>
            <Spinner />
          </View>
        </Modal> */}
        <Layout style={styles.searchBar}>
          <Input
            style={styles.searchBoxInput}
            onChangeText={text => this.searchFilter(text)}
            icon={this.renderSearchIcon}
            placeholder="Search Check In...." size="small" />
        </Layout>
        <Modal
          onBackdropPress={() => this.setState({ addCheckInDisplay: false })}
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
                  enabled={!this.state.bookedStatus}
                  selectedValue={this.state.customerPicker}
                  style={styles.pickerItem}
                  onValueChange={(itemValue, ItemIndex) =>
                    this.setState({ customerPicker: itemValue })}>
                  {(this.props.localCustomers.customers.status !== 'error' && this.props.localCustomers.customers != undefined && this.props.localCustomers.customers != false)
                    ?
                    this.props.localCustomers.customers.result.map((item, index) =>
                      ((this.props.localCustomers.customers.result != false)
                        ? <Picker.Item key={item.id} label={`${item.name} - ${item.phone_number}`} value={item.id} />
                        : '')
                    ) : []}
                </Picker>
              </View>
              <Input
                style={styles.modalInput}
                size="small"
                keyboardType="number-pad"
                label={(this.state.bookedStatus) ? 'Duration Left(minutes)' : 'Duration'}
                value={(this.state.bookedStatus) ? this.state.durationLeft : this.state.inputDuration}
                disabled={this.state.bookedStatus}
                onChangeText={(text) => this.setState({ inputDuration: text })}
              />
              <View style={styles.modalBoxBtnContainer}>
                <Button onPress={() => {
                  if (this.state.bookedStatus) {
                    this.setState({
                      addCheckInDisplay: false,
                      interval: setInterval(this.setCheckOutTimer, 5000)
                    })
                  } else {
                    this.setState({
                      addCheckInDisplay: false,
                    });
                  }
                }} style={styles.modalBoxBtn}>Cancel</Button>
                <Button onPress={() => (this.state.bookedStatus) ? this.checkOut() : this.addCheckIn()} style={styles.modalBoxBtn}>{(this.state.bookedStatus) ? 'Check Out' : 'Check In'}</Button>
              </View>
            </Layout>
          </Layout>
        </Modal>
        <FlatGrid
          refreshing={this.props.localOrders.isLoading}
          refreshControl={<RefreshControl colors={['#284de0']} refreshing={this.props.localOrders.isLoading} onRefresh={() => this.loadData(this.state.signInData.token)} />}
          itemDimension={100}
          items={(this.state.searchStatus) ? this.state.searchFilterData : (this.props.localRooms.rooms.status !== 'error' && this.props.localRooms.rooms.result != undefined) ? this.props.localRooms.rooms.result : []}
          renderItem={({ item, index }) =>
            <View style={this.checkOrder('grid', item.id)}>
              <Text style={this.checkOrder('gridText', item.id)}>{item.name}</Text>
              <Text
                style={styles.gridText}
                onPress={() => this.editValueSetter({
                  inputRoomName: item.name,
                  inputDuration: '',
                  roomID: item.id,
                  customerPicker: (this.getKeyValue(this.props.localOrders.orders.result, 'room_id', item.id, 'customer_id') !== null) ? this.getKeyValue(this.props.localOrders.orders.result, 'id', item.id, 'customer_id') : this.state.customerPicker,
                  durationLeft: this.durationLeftSetter(this.props.localOrders.orders, item),
                  bookedStatus: (this.getKeyValue(this.props.localOrders.orders.result, 'room_id', item.id,  'is_booked')) ? this.getKeyValue(this.props.localOrders.orders.result, 'room_id', item.id,  'is_booked') : false
                }, true)}>{this.orderStatus(item.id)}</Text>
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
