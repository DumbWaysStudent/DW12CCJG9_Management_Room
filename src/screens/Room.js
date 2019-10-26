import React, { Component } from 'react';
import { View, Text, FlatList, Modal, AsyncStorage, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import * as actionRoom from './../redux/actions/actionRoom';
import { Card, Button, Item, Form, Input, Label, Left, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addRoomModalDisplay: false,
      editRoomModalDisplay: false,
      editModalValue: '',
      editModalId: 0,
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
    })
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



  render() {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: '#ddd' }}>
        <Modal
          visible={this.state.addRoomModalDisplay}
          transparent={true}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={styles.addRoomContainer}>
              <Item>
                <Text>Add Room</Text>
                <Right>
                  <Icon onPress={() => this.setState({ addRoomModalDisplay: false })} size={20} name="times" />
                </Right>
              </Item>
              <Item>
                <Input
                  placeholder="input the name of room"
                  onChangeText={(text) => this.setState({ inputRoomName: text })}
                />
              </Item>
              <Button
                onPress={() => this.handleAddRoom()}
                style={{ marginTop: 79 }}>
                <Text style={{ textAlign: 'center', width: '100%' }}>Save</Text>
              </Button>
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.editRoomModalDisplay}
          transparent={true}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={styles.addRoomContainer}>
              <Item>
                <Text>Edit Room</Text>
                <Right>
                  <Icon onPress={() => this.setState({ editRoomModalDisplay: false })} size={20} name="times" />
                </Right>
              </Item>
              <Item>
                <Input
                  value={this.state.editModalValue}
                  onChangeText={(text) => this.setState({ editModalValue: text })}
                />
              </Item>
              <Button
                onPress={() => this.handleEditRoom(this.state.editModalId)}
                style={{ marginTop: 79 }}>
                <Text style={{ textAlign: 'center', width: '100%' }}>Save</Text>
              </Button>
            </View>
          </View>
        </Modal>
        <FlatList
          data={this.props.localRooms.rooms}
          style={{ width: '100%', height: 300 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <TouchableOpacity >
              <Card onTouchEndCapture={() => this.editRoomValueSetter({
              editModalValue: item.name,
              editModalId: item.id
            })} style={{ width: 100, height: 50 }}>
                <Text>{item.name}</Text>
              </Card>
            </TouchableOpacity>
          }
        />
        <Button transparent onPress={() => this.setState({ addRoomModalDisplay: true })}>
          <Icon name="plus" />
          <Text>Add Room</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addRoomContainer: {
    marginVertical: 100,
    marginHorizontal: 35,
    borderWidth: 2,
    borderColor: '#444',
    width: '80%',
    height: 200,
    backgroundColor: '#444',
    borderRadius: 5
  }
})

const mapStateToProps = state => {
  return {
    localRooms: state.rooms
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- TestData ------------//
    handleGetRooms: (params) => dispatch(actionRoom.handleGetRooms(params)),
    handleAddRoom: (params) => dispatch(actionRoom.handleAddRoom(params)),
    handleUpdateRoom: (params) => dispatch(actionRoom.handleUpdateRoom(params))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);

