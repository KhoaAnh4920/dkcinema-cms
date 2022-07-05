import axios from '../axios';




const createNewBanner = (data) => {
    return axios.post('/banner', data)
}


const getAllBanner = () => {
    return axios.get(`/get-list-banner`);
}


const updateStatusBanner = (data) => {
    return axios.put('/status/banner', data)
}


const getDetailBanner = (id) => {
    return axios.get(`/banner/${id}`)
}

const editBanner = (data) => {
    return axios.put('/banner', data)
}


const deleteBanner = (id) => {
    return axios.delete(`/banner/${id}`)
}






export {
    createNewBanner,
    getAllBanner,
    updateStatusBanner,
    getDetailBanner,
    editBanner,
    deleteBanner
};