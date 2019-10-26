import React, { Component } from 'react';
import { View, Text, FlatList, AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import * as actionRoom from './../redux/actions/actionRoom';
import { Card, Button, Item } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);

          this.props.handleGetRooms({
            token: result.token
          });
        }
      }
    })
  }

  render() {
    console.log(this.props.localRooms.rooms);
    return (
      <View style={{flexDirection: 'row', backgroundColor: '#ddd'}}>
        <FlatList
          data={this.props.localRooms.rooms}
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          keyExtractor={ item => item.id}
          renderItem={ ({ item })=>
            <Card style={{width: 100}}>
              <Text>{item.name}</Text>
            </Card>
          }
        />
        <Button transparent>
          <Icon name="plus" />
          <Text>Add Room</Text>
        </Button>
      </View>
    );
  }
}


const mapStateToProps = state => {
  return {
    localRooms: state.rooms
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- TestData ------------//
    handleGetRooms: (params) => dispatch(actionRoom.handleGetRooms(params)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);

