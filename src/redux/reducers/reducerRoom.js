import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    rooms: []
};

export default function reducerRoom(state = initialState, action) {
    switch (action.type) {
        // GET Rooms
        case `${types.GET_ROOMS}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.GET_ROOMS}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                rooms: action.payload.data
            }
        case `${types.GET_ROOMS}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            return state
    }
}
