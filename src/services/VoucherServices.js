import axios from '../axios';



const getAllVoucher = () => {
    return axios.get(`/get-list-voucher`);
}


const createNewVoucherService = (data) => {
    return axios.post('/voucher', data)
}


const updateStatusVoucher = (data) => {
    return axios.put('/status/voucher', data)
}

const updateVoucherService = (data) => {
    return axios.put('/voucher', data)
}

const getEditVoucher = (id) => {
    return axios.get(`/voucher/${id}`)
}


const deleteVoucherService = (id) => {
    return axios.delete(`/users/${id}`);
}


export {
    getAllVoucher,
    createNewVoucherService,
    updateStatusVoucher,
    getEditVoucher,
    updateVoucherService,
    deleteVoucherService
};