import * as types from './../types'
import {API_URL} from './../../api_url';
import axios from 'axios'

export const handleGetHistories = (params) => ({
    type: types.GET_HISTORIES,
    payload: axios({
        method: 'get',
        url: `${API_URL}/histories`,
        headers: {
            Authorization: params.token
        }
    })
});