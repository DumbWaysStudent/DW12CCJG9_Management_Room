import * as types from './../types'
import { Toast } from 'native-base';

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    customers: []
};

export default function reducerCustomer(state = initialState, action) {
    switch (action.type) {
        // GET Customers
        case `${types.GET_CUSTOMERS}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.GET_CUSTOMERS}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                customers: action.payload.data
            }
        case `${types.GET_CUSTOMERS}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // Add Customer
        case `${types.ADD_CUSTOMER}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.ADD_CUSTOMER}_FULFILLED`:
            if (action.payload.data.status == 'error') {
                Toast.show({
                    text: `Error: ${action.payload.data.message}`,
                    textStyle: { fontSize: 12, fontWeight: 'bold' },
                    duration: 2000,
                    style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
                  });
            } else {
                state.customers.push(action.payload.data);
            }
            return {
                ...state,
                isLoading: false,
                isSuccess: true
            }
        case `${types.ADD_CUSTOMER}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // Update Room
        case `${types.UPDATE_CUSTOMER}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.UPDATE_CUSTOMER}_FULFILLED`:
            let index = state.customers.findIndex(x => x.id == action.payload.data.id);
            state.customers[index] = action.payload.data;
            return {
                ...state,
                isLoading: false,
                isSuccess: true
            }
        case `${types.UPDATE_CUSTOMER}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // Delete Customer
        case `${types.DELETE_CUSTOMER}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.DELETE_CUSTOMER}_FULFILLED`:
            let newData = state.customers.filter(x => x.id != action.payload.data.id);
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                customers: newData
            }
        case `${types.DELETE_CUSTOMER}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            return state
    }
}
