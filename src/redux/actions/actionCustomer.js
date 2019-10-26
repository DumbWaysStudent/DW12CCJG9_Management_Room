import * as types from './../types'
import {API_URL} from './../../api_url';
import axios from 'axios'

export const handleGetCustomers = (params) => ({
    type: types.GET_CUSTOMERS,
    payload: axios({
        method: 'get',
        url: `${API_URL}/customers`,
        headers: {
            Authorization: params.token
        }
    })
});

// export const handleAddCustomer = (params) => ({
//     type: types.ADD_ROOM,
//     payload: axios({
//         method: 'post',
//         url: `${API_URL}/room`,
//         data: {
//             name: params.name
//         },
//         headers: {
//             Authorization: params.token
//         }
//     })
// });

// export const handleUpdateEdit = (params) => ({
//     type: types.UPDATE_ROOM,
//     payload: axios({
//         method: 'put',
//         url: `${API_URL}/room/${params.id}`,
//         data: {
//             name: params.name
//         },
//         headers: {
//             Authorization: params.token
//         }
//     })
// })