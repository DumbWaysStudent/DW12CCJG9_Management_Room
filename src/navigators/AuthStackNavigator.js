import { createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Splash from '../screens/Splash';


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
        }
    },
    {
        initialRouteName: 'Splash'
    }
);

export default createAppContainer(AuthStackNavigator);