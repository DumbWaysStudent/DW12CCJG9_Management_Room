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
      addCustomerModalDisplay: false,
      inputCustomerName: '',
      inputIdNum: '',
      inputPhoneNum: '',
      inputImage: 'default-pic',
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

  addCustomer = () => {
    const { inputCustomerName, inputIdNum, inputPhoneNum, inputImage } = this.state;

    if (inputCustomerName == '' && inputIdNum == '' && inputPhoneNum == '') {
      alert('All Field Except Photos Cannot Be Empty!');
    } else {
      this.props.handleAddCustomer({
        data: {
          name: this.state.inputCustomerName,
          identity_number: this.state.inputIdNum,
          phone_number: this.state.inputPhoneNum,
          image: this.state.inputImage
        },
        token: this.state.signInData.token
      });

      if (this.props.localCustomers.isSuccess) {
        this.setState({
          addCustomerModalDisplay: false
        })
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          visible={this.state.addCustomerModalDisplay}
          transparent={true}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={styles.addCustomerContainer}>
              <Item>
                <Text>Add Customer</Text>
                <Right>
                  <Icon onPress={() => this.setState({ addCustomerModalDisplay: false })} size={20} name="times" />
                </Right>
              </Item>
              <Form>
                <Label>Name:</Label>
                <Item>
                  <Input
                    placeholder="input the name of room"
                    onChangeText={(text) => this.setState({ inputCustomerName: text })}
                  />
                </Item>
                <Label>Identity Number:</Label>
                <Item>
                  <Input
                    placeholder="input the customer identity number"
                    onChangeText={(text) => this.setState({ inputIdNum: text })}
                  />
                </Item>
                <Label>Phone Number:</Label>
                <Item>
                  <Input
                    placeholder="input the customer phone number"
                    onChangeText={(text) => this.setState({ inputPhoneNum: text })}
                  />
                </Item>
                <Label>Photos:</Label>
                <Item>
                  <Icon name="camera" size={20} />
                </Item>
                <Button
                  onPress={() => this.addCustomer()}
                  style={{ marginTop: 79 }}>
                  <Text style={{ textAlign: 'center', width: '100%' }}>Save</Text>
                </Button>
              </Form>
            </View>
          </View>
        </Modal>
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
          onPress={() => this.setState({ addCustomerModalDisplay: true })}>
          <Icon name="plus" />
        </Fab>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addCustomerContainer: {
    marginVertical: 100,
    marginHorizontal: 35,
    borderWidth: 2,
    borderColor: '#444',
    width: '80%',
    backgroundColor: '#444',
    borderRadius: 5
  }
})

const mapStateToProps = state => {
  return {
    localCustomers: state.customers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- Customers ------------//
    handleGetCustomers: (params) => dispatch(actionCustomer.handleGetCustomers(params)),
    handleAddCustomer: (params) => dispatch(actionCustomer.handleAddCustomer(params))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Customer);
