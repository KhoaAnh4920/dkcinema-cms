import axios from '../axios';



const getAllCombo = () => {
    return axios.get(`/get-list-combo`);
}


const getItemCombo = (id) => {
    return axios.get(`/item-combo/${id}`)
}


const getDetailCombo = (id) => {
    return axios.get(`/combo/${id}`)
}


const createNewComboService = (data) => {
    return axios.post('/combo', data)
}

const editCombo = (data) => {
    return axios.put('/combo', data)
}

const deleteComboService = (id) => {
    return axios.delete(`/combo/${id}`);
}





export {
    getAllCombo,
    getItemCombo,
    createNewComboService,
    getDetailCombo,
    editCombo,
    deleteComboService
};