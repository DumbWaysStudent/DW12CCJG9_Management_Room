import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList} from 'react-native';
import { connect } from 'react-redux'
import * as actionTest from './../redux/actions/actionTest';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.props.handleGetTestData();
  }

  render() {
    console.log(this.props.localTestData)
    return (
      <View>
        <FlatList
          data={this.props.localTestData.test}
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={ ({ item })=>
            <View>
              <Text>{item.name}</Text>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    
});

const mapStateToProps = state => {
  return {
    localTestData: state.test
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // ----------- TestData ------------//
    handleGetTestData: () => dispatch(actionTest.handleGetTestData()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);
