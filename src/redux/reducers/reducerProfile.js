import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    profile: []
};

export default function reducerProfile(state = initialState, action) {
    switch (action.type) {
        // GET Profile
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
                profile: action.payload.data.result
            }
        case `${types.GET_PROFILE}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        
        // Update Profile
        case `${types.UPDATE_PROFILE}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.UPDATE_PROFILE}_FULFILLED`:
            console.log(action.payload.data)
            // let index = state.profile.findIndex(x => x.id == action.payload.data.result.id );
            // state.profile[index] = action.payload.data.result;
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
            }
        case `${types.UPDATE_PROFILE}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            return state
    }
}
