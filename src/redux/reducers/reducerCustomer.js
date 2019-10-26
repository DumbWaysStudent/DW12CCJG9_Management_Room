import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    customers: []
};

export default function reducerRoom(state = initialState, action) {
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
        
        // Add Room
        // case `${types.ADD_ROOM}_PENDING`:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }
        // case `${types.ADD_ROOM}_FULFILLED`:
        //     state.customers.push(action.payload.data)
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isSuccess: true
        //     }
        // case `${types.ADD_ROOM}_REJECTED`:
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isError: true
        //     }

        // // Update Room
        // case `${types.UPDATE_ROOM}_PENDING`:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }
        // case `${types.UPDATE_ROOM}_FULFILLED`:
        //     let index = state.customers.findIndex( x => x.id == action.payload.data.id);
        //     state.customers[index] = action.payload.data;
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isSuccess: true
        //     }
        // case `${types.UPDATE_ROOM}_REJECTED`:
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isError: true
        //     }
        default:
            return state
    }
}
