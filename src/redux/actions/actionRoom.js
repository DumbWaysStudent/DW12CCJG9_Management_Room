import * as types from './../types'
import {API_URL} from './../../api_url';
import axios from 'axios'

export const handleGetRooms = (params) => ({
    type: types.GET_ROOMS,
    payload: axios({
        method: 'get',
        url: `${API_URL}/rooms`,
        headers: {
            Authorization: params.token
        }
    })
})