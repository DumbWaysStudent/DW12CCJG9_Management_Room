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
          //     customerPicker: this.props.localOrders.orders[0].customerOrder.id
          //   })
          // }
          // })

          this.loadData(result.token);

        } else {
          Toast.show({
            text: "Error: Can't load data.",
            textStyle: { fontSize: 12, fontWeight: 'bold' },
            duration: 2000,
            style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
          });
        }
      } else {
        Toast.show({
          text: "Error: Can't load data.",
          textStyle: { fontSize: 12, fontWeight: 'bold' },
          duration: 2000,
          style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
        });
      }
    });
  }

  // checkAndSetOED = () => {
  //   const data = this.props.localOrders.orders;
  //   const oedData = [];

  //   data.map((o) => {
  //     if (data != false) {
  //       if (data.hasOwnProperty('order_end_time')) {
  //         oedData.push({
  //           id: o.id,
  //           duration: o.duration,
  //           order_end_time: o.order_end_time
  //         });
  //       }
  //     }
  //   });

  //   this.setState({
  //     orders_end_time: oedData
  //   });
  // }

  // setCheckOutTimerData = () => {
  //   const data = this.props.localOrders.orders;
  //   let timeLeft = '';
  //   let matches = null;
  //   let oedData = [];
  //   data.map((o) => {
  //     if (data != false) {
  //       oedData.push({
  //         id: o.id,
  //         order_end_time: o.order_end_time
  //       });
  //     }
  //   });

  //   oedData = oedData.sort();
  //   this.setState({
  //     currentIntervalItem: oedData
  //   });
  // }

  setCheckOutTimer = () => {
    if (this.props.localOrders.orders != false) {
      let order_end_time = this.props.localOrders.orders[0].order_end_time;
      let timeLeft = ''
      let matches = null;

      timeLeft = moment(new Date(order_end_time)).fromNow();
      matches = moment(new Date(order_end_time)).fromNow().match(/(\d+)/g);

      if (matches !== null && timeLeft.search('ago') === -1) {
        timeLeft = matches[0];
      } else {
        timeLeft = '0';
      }
      // console.log(timeLeft);

      if (timeLeft == '0') {
        clearInterval(this.state.interval);
        let id = this.props.localOrders.orders[0].id;

        const findSpecificRoom = (data) => {
          return this.props.localRooms.rooms[this.props.localRooms.rooms.findIndex(x => x.id == data.room_id)];
        }

        this.editValueSetter({
          inputRoomName: findSpecificRoom(this.props.localOrders.orders[0]).name,
          inputDuration: '',
          roomID: findSpecificRoom(this.props.localOrders.orders[0]).id,
          customerPicker: (this.props.localOrders.orders.findIndex(x => x.room_id == findSpecificRoom(this.props.localOrders.orders[0]).id) !== -1)
            ? this.props.localOrders.orders[this.props.localOrders.orders.findIndex(x => x.room_id == findSpecificRoom(this.props.localOrders.orders[0]).id)].customer_id : 0,
          durationLeft: this.durationLeftSetter(this.props.localOrders.orders, findSpecificRoom(this.props.localOrders.orders[0])),
          bookedStatus: (this.props.localOrders.orders.findIndex(x => x.room_id == findSpecificRoom(this.props.localOrders.orders[0]).id) !== -1)
            ? this.props.localOrders.orders[this.props.localOrders.orders.findIndex(x => x.room_id == findSpecificRoom(this.props.localOrders.orders[0]).id)].is_booked : false
        }, false);

        this.checkOut();

        // this.setState({ addCheckInDisplay: true });

      }
    }
  }

  editValueSetter = (params, modalDisplay) => {
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
            Toast.show({
              text: 'Error: Add Check In Failed',
              textStyle: { fontSize: 12, fontWeight: 'bold' },
              duration: 2000,
              style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
            });
          } else {
            this.setState({
              inputRoomName: '',
              inputDuration: '',
              roomID: null,
              durationLeft: '0',
              bookedStatus: false
            })
          }
        })
      this.setState({
        addCheckInDisplay: false,
      })
    } else {
      Toast.show({
        text: 'Error: customer not found and duration cannot be empty',
        textStyle: { fontSize: 12, fontWeight: 'bold' },
        duration: 2000,
        style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
      });
    }
  }

  checkOut = () => {
    this.setState({ addCheckInDisplay: false })
    this.props.handleCheckOut({
      room_id: this.state.roomID,
      token: this.state.signInData.token
    })
      .then(() => {
        if (this.props.localOrders.orders.status == 'error') {
          Toast.show({
            text: "Error: Can't Checkout",
            textStyle: { fontSize: 12, fontWeight: 'bold' },
            duration: 2000,
            style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
          });
        } else {
          this.setState({
            interval: setInterval(this.setCheckOutTimer, 1000)
          })
        }
      })
  }

  durationSetter = (data, dataToCompare) => {
    let index = data.findIndex(x => x.room_id == dataToCompare.id);
    if (index !== -1) {
      return (data[index].duration - 1).toString();
    } else {
      return '0';
    }
  }

  durationLeftSetter = (data, dataToCompare) => {
    let matches, durationLeft;
    let index = data.findIndex(x => x.room_id == dataToCompare.id);
    if (index !== -1) {
      durationLeft = moment(new Date(data[index].order_end_time)).fromNow();
      matches = durationLeft.match(/(\d+)/g);
      if (matches !== null) {
        if (durationLeft.search('ago') === -1) {

          return (Number.parseInt(matches[0]) - 1).toString();
        } else {
          return '0';
        }
      } else {
        return '0';
      }
    } else {
      return '0';
    }
  }

  loadData = (token) => {
    this.props.handleGetRooms({
      token: token
    })
      .then(() => {
        this.props.handleGetOrders({
          token: token
        })
          .then(() => {
            this.props.handleGetCustomers({
              token: token
            })
              .then(() => {
                if (this.props.localOrders.isSuccess) {
                  // this.setCheckOutTimerData();
                  if (this.props.localOrders.orders.hasOwnProperty('status')) {
                    if (this.props.localOrders.orders.status == 'error') {
                      Toast.show({
                        text: this.props.localOrders.orders.message,
                        textStyle: { fontSize: 12, fontWeight: 'bold' },
                        duration: 2000,
                        style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
                      });
                    }
                  } else {
                    this.setState({
                      interval: setInterval(this.setCheckOutTimer, 1000),
                      customerPicker: (this.props.localCustomers.customers != false) ? this.props.localCustomers.customers[0].id : null
                    })
                  }
                } else {
                  Toast.show({
                    text: "Error: Can't load data, please check your internet connection and try again.",
                    textStyle: { fontSize: 12, fontWeight: 'bold' },
                    duration: 2000,
                    style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
                  });
                }
              })
              .catch(() => {
                Toast.show({
                  text: "Error: Can't load data, please check your internet connection and try again.",
                  textStyle: { fontSize: 12, fontWeight: 'bold' },
                  duration: 2000,
                  style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
                });
              })
          })
          .catch(() => {
            Toast.show({
              text: "Error: Can't load data, please check your internet connection and try again.",
              textStyle: { fontSize: 12, fontWeight: 'bold' },
              duration: 2000,
              style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
            });
          })
      })
      .catch(() => {
        Toast.show({
          text: "Error: Can't load data, please check your internet connection and try again.",
          textStyle: { fontSize: 12, fontWeight: 'bold' },
          duration: 2000,
          style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
        });
      })
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
    const newData = this.props.localRooms.rooms.filter(item => {
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
                  {this.props.localCustomers.customers.map((item, index) =>
                    ((this.props.localCustomers.customers != false)
                      ? <Picker.Item label={`${item.name} - ${item.phone_number}`} value={item.id} />
                      : '')
                  )}
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
                      interval: setInterval(this.setCheckOutTimer, 1000)
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
          items={(this.state.searchStatus) ? this.state.searchFilterData : this.props.localRooms.rooms}
          renderItem={({ item, index }) =>
            <View style={
              ((this.props.localOrders.orders.findIndex(x => x.room_id == item.id) !== -1)
                ? (this.props.localOrders.orders[this.props.localOrders.orders.findIndex(x => x.room_id == item.id)].is_booked
                  ? [styles.checkinGrid, styles.isBookedTrue]
                  : [styles.checkinGrid, styles.isBookedFalse])
                : [styles.checkinGrid, styles.isBookedFalse])}>
              <Text
                style={styles.gridText}
                onPress={() => this.editValueSetter({
                  inputRoomName: item.name,
                  inputDuration: '',
                  roomID: item.id,
                  customerPicker: (this.props.localOrders.orders.findIndex(x => x.room_id == item.id) !== -1) ? this.props.localOrders.orders[this.props.localOrders.orders.findIndex(x => x.room_id == item.id)].customer_id : this.state.customerPicker,
                  durationLeft: this.durationLeftSetter(this.props.localOrders.orders, item),
                  bookedStatus: (this.props.localOrders.orders.findIndex(x => x.room_id == item.id) !== -1) ? this.props.localOrders.orders[this.props.localOrders.orders.findIndex(x => x.room_id == item.id)].is_booked : false
                }, true)}>{item.name}</Text>
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
