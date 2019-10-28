import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    profile: []
};

export default function reducerOrder(state = initialState, action) {
    switch (action.type) {
        // GET Orders
        case `${types.GET_PROFILE}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.GET_PROFILE}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                profile: action.payload.data
            }
        case `${types.GET_PROFILE}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            return state
    }
}
