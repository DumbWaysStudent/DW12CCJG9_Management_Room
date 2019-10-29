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
            if (action.payload.data.status == 'error') {
                Toast.show({
                    text: `Error: ${action.payload.data.message}`,
                    textStyle: { fontSize: 12, fontWeight: 'bold' },
                    duration: 2000,
                    style: { backgroundColor: '#ff3333', marginHorizontal: 5, marginBottom: 70, borderRadius: 5 }
                });
            } else {
                state.rooms.push(action.payload.data)
            }
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
            let index = state.rooms.findIndex(x => x.id == action.payload.data.id);
            state.rooms[index] = action.payload.data;
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
            let newData = state.rooms.filter(x => x.id != action.payload.data.id);
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                rooms: newData
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
