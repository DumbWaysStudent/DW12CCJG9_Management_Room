import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import StackNavigator from './StackNavigator';

const RootNavigator = createSwitchNavigator({
    StackNavigator
},
{
    initialRouteName: 'StackNavigator',
})

export default createAppContainer(RootNavigator);