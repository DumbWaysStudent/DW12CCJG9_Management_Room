import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthStackNavigator from './AuthStackNavigator';
import HomeTabNavigator from './HomeTabNavigator';

const RootNavigator = createSwitchNavigator({
    AuthStackNavigator,
    HomeTabNavigator
},
{
    initialRouteName: 'AuthStackNavigator',
})

export default createAppContainer(RootNavigator);