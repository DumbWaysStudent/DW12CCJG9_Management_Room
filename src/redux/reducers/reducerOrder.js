import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    orders: []
};

export default function reducerOrder(state = initialState, action) {
    switch (action.type) {
        // GET Orders
        case `${types.GET_ORDERS}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.GET_ORDERS}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                orders: action.payload.data.sort()
            }
        case `${types.GET_ORDERS}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        
        // Add CheckIn
        case `${types.CHECK_IN}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.CHECK_IN}_FULFILLED`:
            state.orders.push(action.payload.data.result)
            state.orders = state.orders.sort()
            return {
                ...state,
                isLoading: false,
                isSuccess: true
            }
        case `${types.CHECK_IN}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // CheckOut
        case `${types.CHECK_OUT}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.CHECK_OUT}_FULFILLED`:
            let newData = state.orders.filter(x => x.room_id != action.payload.data.room_id);
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                orders: newData.sort()
            }
        case `${types.CHECK_OUT}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            return state
    }
}
