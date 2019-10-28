import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Layout, Text, Input, Button, Spinner } from 'react-native-ui-kitten';
import { Fab } from 'native-base';
import { connect } from 'react-redux'
import * as actionRoom from './../redux/actions/actionRoom';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FlatGrid } from 'react-native-super-grid';
import styles from './../assets/styles/main.styles'
import { TouchableOpacity } from 'react-native-gesture-handler';

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
      signInData: null
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);

          this.setState({
            signInData: result
          });

          this.props.handleGetRooms({
            token: result.token
          });
        }
      }
    });
  }

  handleAddRoom = () => {
    if (this.state.inputRoomName == '') {
      alert('Room Name Cannot Be Empty!');
    } else {
      this.props.handleAddRoom({
        name: this.state.inputRoomName,
        token: this.state.signInData.token
      })

      if (this.props.localRooms.isSuccess) {
        this.setState({
          addRoomModalDisplay: false
        })
      }
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
    });

    if (this.props.localRooms.isSuccess) {
      this.setState({ editRoomModalDisplay: false })
    }
  }

  deleteRoom = (id) => {
    this.setState({
      editRoomModalDisplay: false,
      onDelete: true
    });

    this.props.handleDeleteRoom({
      id,
      token: this.state.signInData.token
    })
    .then((result) => {
      console.log(result.action.payload.status)
      alert('Room Deleted')
    })
  }

  render() {
    return (
      <Layout style={[styles.container, styles.containerHome]}>
        <Modal
          isVisible={this.props.localRooms.isLoading}
          backdropOpacity={0.3}>
          <View style={{ flex: 1 }}>
            <Spinner />
          </View>
        </Modal>
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
            <Button  onPress={() => this.deleteRoom(this.state.editModalId)} style={(this.state.onDelete ? [styles.modalTrashBtn, styles.modalTrashBtnOnPress] : styles.modalTrashBtn)}> <Icon size={15} name="trash-alt" />
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
          itemDimension={110}
          items={this.props.localRooms.rooms}
          renderItem={({ item }) =>
            <View style={styles.checkinGrid} onTouchEndCapture={() => this.editRoomValueSetter({
              editModalValue: item.name,
              editModalId: item.id
            })}><Text>{item.name}</Text></View>
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
    localRooms: state.rooms
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

