import React, { Component } from 'react';
import { View, Text, AsyncStorage, FlatList } from 'react-native';
import { connect } from 'react-redux'
import * as actionOrder from './../redux/actions/actionOrder';
import { Card, Button, Item, Form, Input, Label, Left, Right } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    AsyncStorage.getItem('signInData', (e, result) => {
      if (!e) {
        if (result !== null) {
          result = JSON.parse(result);

          this.setState({
            signInData: result
          });

          this.props.handleGetOrders({
            token: result.token
          });
          
          console.log(this.props.localOrders.orders)
        }
      }
    });
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.localOrders.orders}
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
              <Card onTouchEndCapture={() => alert('Booked')} style={(item.is_booked == false) ? {backgroudnColor: 'grey', width: 100, height:  50} : {backgroundColor: 'green', width: 100, height:  50}}>
                <Text>{item.name}</Text>
              </Card>
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    localOrders: state.orders
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- Customers ------------//
    handleGetOrders: (params) => dispatch(actionOrder.handleGetOrders(params)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckIn);
