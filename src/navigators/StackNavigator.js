import { createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Test from '../screens/Test'
import Splash from '../screens/Splash'


const UnauthStackNavigator = createStackNavigator({
        Test: {
            screen: Test,
            navigationOptions: () => ({
                header: null,
            })
        },
        Splash: {
            screen: Splash,
            navigationOptions: () => ({
                header: null,
            })
        }
    },
    {
        initialRouteName: 'Test'
    }
);

export default createAppContainer(UnauthStackNavigator);