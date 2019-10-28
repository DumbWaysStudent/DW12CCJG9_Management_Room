import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import CheckIn from '../screens/CheckIn';
import Room from '../screens/Room';
import Customer from '../screens/Customer';
import Settings  from '../screens/Settings';


const HomeTabNavigator = createBottomTabNavigator({
    CheckIn: {
        screen: CheckIn,
        navigationOptions: () => ({
            header: null,
            tabBarLabel: "Check In",
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="check-circle" size={18} color={tintColor} />)
        })
    },
    Room: {
        screen: Room,
        navigationOptions: () => ({
            header: null,
            tabBarLabel: "Room",
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="bed" size={18} color={tintColor} />)
        })
    },
    Customer: {
        screen: Customer,
        navigationOptions: () => ({
            header: null,
            tabBarLabel: "Customer",
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="user-circle" size={18} color={tintColor} />)
        })
    },
    Settings: {
        screen: Settings,
        navigationOptions: () => ({
            header: null,
            tabBarLabel: "Settings",
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="wrench" size={18} color={tintColor} />)
        })
    }
},
    {
        initialRouteName: 'CheckIn',
        tabBarOptions: {
            activeTintColor: '#ffffff',
            inactiveTintColor: '#a6c1ff',
            style: { paddingVertical: 5, backgroundColor: '#284de0', height: 60 },
            labelStyle: { fontWeight: 'bold' }
        },
    }
);

export default createAppContainer(HomeTabNavigator);