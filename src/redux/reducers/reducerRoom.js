import * as types from './../types';
import { Toast } from 'native-base';

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

        // Add Room
        case `${types.ADD_ROOM}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.ADD_ROOM}_FULFILLED`:
            state.rooms.status = action.payload.data.status;
            state.rooms.result.push(action.payload.data.result)
            return {
                ...state,
                isLoading: false,
                isSuccess: true
            }
        case `${types.ADD_ROOM}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // Update Room
        case `${types.UPDATE_ROOM}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.UPDATE_ROOM}_FULFILLED`:
            state.rooms.status = action.payload.data.status;
            let index = state.rooms.result.findIndex(x => x.id == action.payload.data.result.id);
            state.rooms.result[index] = action.payload.data.result;
            return {
                ...state,
                isLoading: false,
                isSuccess: true
            }
        case `${types.UPDATE_ROOM}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // Delete Room
        case `${types.DELETE_ROOM}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.DELETE_ROOM}_FULFILLED`:
            state.rooms.status = action.payload.data.status;
            let newData = state.rooms.result.filter(x => x.id != action.payload.data.room_id);
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                rooms: {result: newData}
            }
        case `${types.DELETE_ROOM}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            return state
    }
}
