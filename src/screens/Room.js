import React, { Component } from 'react';
import { View, AsyncStorage, RefreshControl } from 'react-native';
import { Layout, Text, Input, Button, Spinner } from 'react-native-ui-kitten';
import { Fab, Toast } from 'native-base';
import { connect } from 'react-redux'
import * as actionRoom from './../redux/actions/actionRoom';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FlatGrid } from 'react-native-super-grid';
import styles from './../assets/styles/main.styles'
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addRoomModalDisplay: false,
      editRoomModalDisplay: false,
      editModalValue: '',
      editModalId: 0,
      onDelete: false,
      inputRoomName: '',
      signInData: null,
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

  handleAddRoom = () => {
    if (this.state.inputRoomName == '') {
      Toast.show({
        text: `Error: Room Name Cannot Be Empty!`,
        textStyle: { fontSize: 12, fontWeight: 'bold' },
        duration: 2000,
        style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
      });
    } else {
      this.props.handleAddRoom({
        name: this.state.inputRoomName,
        token: this.state.signInData.token
      })
        .then(() => {
          this.setState({
            inputRoomName: '',
            editModalValue: '',
            editModalId: 0,
          })
        });

      this.setState({
        addRoomModalDisplay: false,
      })
    }
  }

  editRoomValueSetter = (params) => {
    params.editRoomModalDisplay = true;
    this.setState(params);
  }

  handleEditRoom = (id) => {
    this.props.handleUpdateRoom({
      id,
      name: this.state.editModalValue,
      token: this.state.signInData.token
    })
      .then(() => {
        this.setState({
          inputRoomName: '',
          editModalValue: '',
          editModalId: 0,
        })
      })

    this.setState({
      editRoomModalDisplay: false,
    })
  }

  deleteRoom = (id) => {
    this.setState({
      editRoomModalDisplay: false,
      onDelete: true
    });

    if (this.props.localOrders.orders.findIndex(x => x.room_id == id) == -1) {
      this.props.handleDeleteRoom({
        id,
        token: this.state.signInData.token
      })

      this.setState({
        addCustomerModalDisplay: false,
        inputRoomName: '',
        editModalValue: '',
        editModalId: 0,
      });
    } else {
      Toast.show({
        text: "Error: Order in this room is found, please checkout first.",
        textStyle: { fontSize: 12, fontWeight: 'bold' },
        duration: 2000,
        style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
      });
    }
  }

  loadData = (token) => {
    this.props.handleGetRooms({
      token: token
    })
      .then(() => {
        if (this.props.localRooms.rooms.hasOwnProperty('status')) {
          if (this.props.localRooms.rooms.status == 'error') {
            Toast.show({
              text: this.props.localRooms.rooms.message,
              textStyle: { fontSize: 12, fontWeight: 'bold' },
              duration: 2000,
              style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
            });
          }
        }
      })
      .catch((result) => {
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
      <Layout style={[styles.container, styles.containerHome]}>
        <Layout style={styles.searchBar}>
          <Input
            onChangeText={text => this.searchFilter(text)}
            icon={this.renderSearchIcon}
            placeholder="Search Room...."
            size="small" />
        </Layout>
        {/* <Modal
          isVisible={this.props.localRooms.isLoading}
          backdropOpacity={0.3}>
          <View style={{ flex: 1, position: 'absolute', top: 220, right: 140 }}>
            <Spinner />
          </View>
        </Modal> */}
        <Modal
          isVisible={this.state.addRoomModalDisplay}
          onBackButtonPress={() => this.setState({ addRoomModalDisplay: false })}
          backdropOpacity={0.3}>
          <Layout style={[styles.modalBox, styles.roomModal]}>
            <Text style={styles.modalBoxTitle} category="h5">Add Room</Text>
            <Layout>
              <Input
                style={styles.modalInput}
                size="small"
                label="Room Name"
                value={this.state.inputRoomName}
                onChangeText={(text) => this.setState({ inputRoomName: text })}
              />
              <View style={styles.modalBoxBtnContainer}>
                <Button onPress={() => this.setState({ addRoomModalDisplay: false })} style={styles.modalBoxBtn}>Cancel</Button>
                <Button onPress={() => this.handleAddRoom()} style={styles.modalBoxBtn}>Save</Button>
              </View>
            </Layout>
          </Layout>
        </Modal>
        <Modal
          isVisible={this.state.editRoomModalDisplay}
          onBackButtonPress={() => this.setState({ editRoomModalDisplay: false })}
          backdropOpacity={0.3}>
          <Layout style={[styles.modalBox, styles.roomModal]}>
            <Button onPress={() => this.deleteRoom(this.state.editModalId)} style={(this.state.onDelete ? [styles.modalTrashBtn, styles.modalTrashBtnOnPress] : styles.modalTrashBtn)}> <Icon size={15} name="trash-alt" />
            </Button>
            <Text style={styles.modalBoxTitle} category="h5">Edit Room</Text>
            <Layout>
              <Input
                style={styles.modalInput}
                size="small"
                label="Room Name"
                value={this.state.editModalValue}
                onChangeText={(text) => this.setState({ editModalValue: text })}
              />
              <View style={styles.modalBoxBtnContainer}>
                <Button onPress={() => this.setState({ editRoomModalDisplay: false })} style={styles.modalBoxBtn}>Cancel</Button>
                <Button onPress={() => this.handleEditRoom(this.state.editModalId)} style={styles.modalBoxBtn}>Save</Button>
              </View>
            </Layout>
          </Layout>
        </Modal>
        <FlatGrid
          refreshing={this.props.localRooms.isLoading}
          refreshControl={<RefreshControl colors={['#284de0']} refreshing={this.props.localRooms.isLoading} onRefresh={() => this.loadData(this.state.signInData.token)} />}
          itemDimension={100}
          items={(this.state.searchStatus) ? this.state.searchFilterData : this.props.localRooms.rooms}
          renderItem={({ item }) =>
            <View style={styles.checkinGrid}><Text
              style={[styles.gridText, styles.gridRoomText]}
              onPress={() => this.editRoomValueSetter({
                editModalValue: item.name,
                editModalId: item.id
              })}>{item.name}</Text></View>
          }
        />
        <Fab
          style={{ backgroundColor: '#ffffff', position: 'relative' }}
          position="bottomRight"
          onPress={() => this.setState({ addRoomModalDisplay: true })}>
          <Icon name="plus" style={{ color: '#284de0' }} />
        </Fab>
      </Layout>
    );
  }
}

// const styles = StyleSheet.create({
//   addRoomContainer: {
//     marginVertical: 100,
//     marginHorizontal: 35,
//     borderWidth: 2,
//     borderColor: '#444',
//     width: '80%',
//     height: 200,
//     backgroundColor: '#444',
//     borderRadius: 5
//   }
// })

const mapStateToProps = state => {
  return {
    localRooms: state.rooms,
    localOrders: state.orders
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- Rooms ------------//
    handleGetRooms: (params) => dispatch(actionRoom.handleGetRooms(params)),
    handleAddRoom: (params) => dispatch(actionRoom.handleAddRoom(params)),
    handleUpdateRoom: (params) => dispatch(actionRoom.handleUpdateRoom(params)),
    handleDeleteRoom: (params) => dispatch(actionRoom.handleDeleteRoom(params))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);

