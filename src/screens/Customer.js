import React, { Component } from 'react';
import { View, FlatList, Modal, AsyncStorage, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import * as actionCustomer from './../redux/actions/actionCustomer';
import { Card, Button, Item, Form, Input, Label, Left, Right, Text, Fab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInData: null
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
        }
      }
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={this.props.localCustomers.customers}
          style={{ width: '100%', height: 300 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <Card style={{ flexDirection: 'row', width: '90%', alignSelf: 'center' }}>
              <Icon name="user-circle" size={40} style={{ marginVertical: 10, marginHorizontal: 10 }} />
              <Item style={{ flexDirection: 'column' }}>
                <Text>{item.name}</Text>
                <Text>{item.identity_number}</Text>
                <Text>{item.phone_number}</Text>
              </Item>
            </Card>
          }
        />
        <Fab
          style={{ backgroundColor: '#ee7a33' }}
          position="bottomRight"
          onPress={() => alert('Add Customer')}>
          <Icon name="plus" />
        </Fab>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    localCustomers: state.customers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- Customers ------------//
    handleGetCustomers: (params) => dispatch(actionCustomer.handleGetCustomers(params)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Customer);
