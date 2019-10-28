import * as types from './../types'
import {API_URL} from './../../api_url';
import axios from 'axios'

export const handleGetOrders = (params) => ({
    type: types.GET_ORDERS,
    payload: axios({
        method: 'get',
        url: `${API_URL}/checkin`,
        headers: {
            Authorization: params.token
        }
    })
});

export const handleAddCheckIn = (params) => ({
    type: types.CHECK_IN,
    payload: axios({
        method: 'post',
        url: `${API_URL}/checkin`,
        data: params.data,
        headers: {
            Authorization: params.token
        }
    })
});

// export const handleUpdateCustomer = (params) => ({
//     type: types.UPDATE_CUSTOMER,
//     payload: axios({
//         method: 'put',
//         url: `${API_URL}/customer/${params.id}`,
//         data: params.data,
//         headers: {
//             Authorization: params.token
//         }
//     })
// })