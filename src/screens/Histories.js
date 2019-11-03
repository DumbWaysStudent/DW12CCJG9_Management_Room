import React, { Component } from 'react';
import { View, Text, FlatList, AsyncStorage, RefreshControl } from 'react-native';
import { Layout, Input } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Card } from 'native-base';
import { connect } from 'react-redux';
import * as actionHistory from './../redux/actions/actionHistory';
import moment from 'moment';
import styles from './../assets/styles/main.styles'

class Histories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInData: null,
      searchFilterData: [],
      searchStatus: false,
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

  loadData = (token) => {
    this.props.handleGetHistories({
      token
    })
      .then(() => {
        console.log(this.props.localHistories.histories);
      })
  }

  checkInConvertDate = (date, duration) => {
    return moment(date).subtract(duration + 1, 'minute').toDate().toDateString() + ' ' + moment(date).subtract(duration + 1, 'minute').toDate().toLocaleTimeString();
  }

  checkOutConvertDate = (date) => {
    return moment(date).toDate().toDateString() + ' ' + moment(date).toDate().toLocaleTimeString()
  }

  orderEndTimeConvertDate = (date) => {
    return moment(date).toDate().toDateString() + ' ' + moment(date).subtract(1, 'minute').toDate().toLocaleTimeString()
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
    const newData = this.props.localHistories.histories.result.filter(item => {
      const itemData = `${item.room_name.toUpperCase()}`;
      const textData = text.toUpperCase();

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
      <View>
        <Layout style={styles.searchBar}>
          <Input
            onChangeText={text => this.searchFilter(text)}
            icon={this.renderSearchIcon}
            placeholder="Search Room...."
            size="small" />
        </Layout>
        <FlatList
          style={styles.historyContainer}
          refreshing={this.props.localHistories.isLoading}
          refreshControl={<RefreshControl colors={['#284de0']} refreshing={this.props.localHistories.isLoading} onRefresh={() => this.loadData(this.state.signInData.token)} />}
          data={(this.state.searchStatus) ? this.state.searchFilterData : this.props.localHistories.histories.result}
          renderItem={({ item, index }) =>
            <Card style={(index == this.props.localHistories.histories.result.length - 1) ? [styles.historyCard, styles.historyCardLast] : styles.historyCard}>
              <Text style={styles.historyCardText}>Order ID: <Text style={{ fontWeight: 'normal' }}>{item.id}</Text></Text>
              <Text style={styles.historyCardText}>Room Name: <Text style={{ fontWeight: 'normal' }}>{item.room_name}</Text></Text>
              <Text style={styles.historyCardText}>Customer Name: <Text style={{ fontWeight: 'normal' }}>{item.customer_name}</Text></Text>
              <Text style={styles.historyCardText}>Identity Number: <Text style={{ fontWeight: 'normal' }}>{item.identity_number}</Text></Text>
              <Text style={styles.historyCardText}>Phone Number: <Text style={{ fontWeight: 'normal' }}>{item.phone_number}</Text></Text>
              <Text style={styles.historyCardText}>Duration: <Text style={{ fontWeight: 'normal' }}>{item.duration} minute</Text></Text>
              <Text style={styles.historyCardText}>Check In  : <Text style={{ fontWeight: 'normal' }}>{this.checkInConvertDate(item.order_end_time, item.duration)}</Text></Text>
              <Text style={styles.historyCardText}>Check Out  : <Text style={{ fontWeight: 'normal' }}>{this.checkOutConvertDate(item.createdAt)}</Text></Text>
              <Text style={styles.historyCardText}>Order End Time: <Text style={{ fontWeight: 'normal' }}>{this.orderEndTimeConvertDate(item.order_end_time)}</Text></Text>
              <Text style={styles.historyCardText}>Status: <Text style={{ fontWeight: 'normal' }}>{item.is_done ? 'Done' : 'Not Done'}</Text></Text>
            </Card>
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    localHistories: state.histories
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- Histories ------------//
    handleGetHistories: (params) => dispatch(actionHistory.handleGetHistories(params)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Histories);

