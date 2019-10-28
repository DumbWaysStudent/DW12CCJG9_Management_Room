//combine all reducer
import { combineReducers } from 'redux';
import { createNavigationReducer } from 'react-navigation-redux-helpers';

import RootNavigator from './../../navigators/RootNavigator'
import reducerRoom from './../reducers/reducerRoom';
import reducerCustomer from './../reducers/reducerCustomer';
import reducerOrder from './../reducers/reducerOrder';
import reducerProfile from './../reducers/reducerProfile';

const reducerRouter = createNavigationReducer(RootNavigator);

const appReducer = combineReducers({
  router: reducerRouter,
  rooms: reducerRoom,
  customers: reducerCustomer,
  orders: reducerOrder,
  profile: reducerProfile
})

export default appReducer