import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    histories: []
};

export default function reducerHistory(state = initialState, action) {
    switch (action.type) {
        // GET Histories
        case `${types.GET_HISTORIES}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.GET_HISTORIES}_FULFILLED`:
            // console.log(action.payload.data.result)
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                histories: action.payload.data
            }
        case `${types.GET_HISTORIES}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        case types.ADD_HISTORY:
                if (action.payload != false) {
                    if (state.histories == false) {
                        state.histories = {result: [action.payload]}
                    } else {
                        state.histories.result.push(action.payload)
                    }
                }
                
                return {
                    ...state,
                    isLoading: false,
                    isSuccess: true
                }
        default:
            return state;
            break;
    }
}