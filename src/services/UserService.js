import axios from '../axios';
import authHeader from "./auth-header";

const hanedleLoginUser = (userEmail, userPassword) => {

    return axios.post('/cms/admin-login', { email: userEmail, password: userPassword }) // req.body.email, req.body.password //
}

const getAllUser = () => {
    //  console.log("authHeader: ", authHeader());
    return axios.get(`/get-list-users`, { headers: authHeader() })
}


const getAllStaff = (data) => {
    return axios.get(`/get-list-staff`, { params: { movieTheaterId: data.movieTheaterId } })
}

const getAllRoles = () => {
    return axios.get(`/get-roles`) // truyen API method GET 
}

const getEditUser = (id) => {
    return axios.get(`/users/${id}`)
}


const getUserByRole = (roleId) => {
    return axios.get(`/role/users/${roleId}`)
}

const createNewUserService = (data) => {
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
    deleteUserService,
    getUserByRole,
    getAllStaff
};