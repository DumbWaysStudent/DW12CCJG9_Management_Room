import * as types from './../types'
import {API_URL} from './../../api_url';
import axios from 'axios'

export const handleGetProfile = (params) => ({
    type: types.GET_PROFILE,
    payload: axios({
        method: 'get',
        url: `${API_URL}/profile/${params.id}`,
        headers: {
            Authorization: params.token
        }
    })
});

export const handleUpdateProfile = (params) => ({
    type: types.UPDATE_PROFILE,
    payload: axios({
        method: 'post',
        url: `${API_URL}/profile/${params.id}`,
        data: params.data.formData,
        headers: {
            Authorization: params.token
        }
    })
})