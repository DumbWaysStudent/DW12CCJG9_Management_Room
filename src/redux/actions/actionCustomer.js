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

export const handleAddCustomer = (params) => ({
    type: types.ADD_CUSTOMER,
    payload: axios({
        method: 'post',
        url: `${API_URL}/customer`,
        data: params.data,
        headers: {
            Authorization: params.token
        }
    })
});

export const handleUpdateCustomer = (params) => ({
    type: types.UPDATE_CUSTOMER,
    payload: axios({
        method: 'put',
        url: `${API_URL}/customer/${params.id}`,
        data: params.data,
        headers: {
            Authorization: params.token
        }
    })
})