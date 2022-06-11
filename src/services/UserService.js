import axios from '../axios';


const hanedleLoginUser = (userEmail, userPassword) => {

    return axios.post('/admin-login', { email: userEmail, password: userPassword }) // req.body.email, req.body.password //
}

const getAllUser = () => {
    return axios.get(`/get-list-users`)
}

const getAllRoles = () => {
    return axios.get(`/get-roles`) // truyen API method GET 
}

const getEditUser = (id) => {
    return axios.get(`/users/${id}`)
}

const createNewUserService = (data) => {
    console.log("Data: ", data);
    return axios.post('/users', data)
}

const updateUserService = (data) => {
    return axios.put('/users', data)
}

const deleteUserService = (id) => {
    return axios.delete(`/users/${id}`);
}


export {
    hanedleLoginUser,
    getAllUser,
    getAllRoles,
    createNewUserService,
    getEditUser,
    updateUserService,
    deleteUserService
};