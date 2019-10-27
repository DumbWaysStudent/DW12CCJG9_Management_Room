import * as types from './../types'
// import axios from 'axios'

// export const handleGetImages = (params) => ({
//     type: types.GET_IMAGES,
//     payload: axios({
//         method: 'get',
//         url: `https://smoketoon-api.herokuapp.com/api/v1/webtoon/${params.webtoonID}/episode/${params.episodeID}`,
//         headers: {
//             Authorization: params.token
//         }
//     })
// })

export const handleGetTestData = () => ({
    type: types.GET_TEST_DATA,
    payload: [{
        id: 1,
        name: 'Test',
    }, {
        id: 2,
        name: 'C',
    }]
})

export const handleStoreTestData = (params) => ({
    type: types.STORE_TEST_DATA,
    payload: params
})

export const handleUpdateTestData = (params) => ({
    type: types.GET_TEST_DATA,
    payload: params
})

export const handleDeleteTestData = (id) => ({
    type: types.GET_TEST_DATA,
    payload: id
})
