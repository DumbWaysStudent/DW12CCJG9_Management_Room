import * as types from './../types'

const initialState = {
    // isLoading: false,
    // isError: false,
    // isSuccess: false,
    test: []
};

export default function reducerTest(state = initialState, action) {
    switch (action.type) {
        case types.GET_TEST_DATA:
            return {
                ...state,
                test: action.payload
            }
        case types.STORE_TEST_DATA:
            state.test.push(action.payload)
            return {
                ...state
            }
        case types.UPDATE_TEST_DATA:
            let index = state.test.findIndex(x => x.id === action.payload.id)
            state.test[index] = action.payload.id
            return {
                ...state
            }
        case types.DELETE_TEST_DATA:
            let newData = state.test.filter(x => x.id !== action.payload.id)
            return {
                ...state,
                test: newData
            }


        // GET TEST DATA
        // case `${types.GET_TEST_DATA}_PENDING`:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }
        // case `${types.GET_TEST_DATA}_FULFILLED`:
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isSuccess: true,
        //         test: action.payload
        //     }
        // case `${types.GET_TEST_DATA}_REJECTED`:
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isError: true
        //     }

        // // ADD TEST DATA
        // case `${types.ADD_EPISODE}_PENDING`:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }
        // case `${types.ADD_EPISODE}_FULFILLED`:
        //     state.test.push(action.payload)
        //     alert('Episode Created!')
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isSuccess: true
        //     }
        // case `${types.ADD_EPISODE}_REJECTED`:
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isError: true
        //     }

        // // UPDATE TEST DATA
        // case `${types.UPDATE_EPISODE}_PENDING`:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }
        // case `${types.UPDATE_EPISODE}_FULFILLED`:
        //     let index = state.test.findIndex( x => x.id == action.payload.id)
        //     state.test[index] = action.payload
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isSuccess: true
        //     }
        // case `${types.UPDATE_EPISODE}_REJECTED`:
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isError: true
        //     }

        // // DELETE TEST DATA
        // case `${types.DELETE_EPISODE}_PENDING`:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }
        // case `${types.DELETE_EPISODE}_FULFILLED`:
        //         let newData = state.test.filter((item) => item.id != action.payload.id)
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isSuccess: true,
        //         test: newData
        //     }
        // case `${types.DELETE_EPISODE}_REJECTED`:
        //     return {
        //         ...state,
        //         isLoading: false,
        //         isError: true
        //     }
        default:
            return state
    }
}
