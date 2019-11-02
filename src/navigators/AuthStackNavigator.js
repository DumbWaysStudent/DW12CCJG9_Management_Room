import { createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Splash from '../screens/Splash';
import ErrorConnection from '../screens/ErrorConnection';


const AuthStackNavigator = createStackNavigator({
        SignIn: {
            screen: SignIn,
            navigationOptions: () => ({
                header: null,
            })
        },
        SignUp: {
            screen: SignUp,
            navigationOptions: () => ({
                header: null,
            })
        },
        Splash: {
            screen: Splash,
            navigationOptions: () => ({
                header: null,
            })
        },
        ErrorConnection: {
            screen: ErrorConnection,
            navigationOptions: () => ({
                header: null,
            })
        }
    },
    {
        initialRouteName: 'Splash'
    }
);

export default createAppContainer(AuthStackNavigator);