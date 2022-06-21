import axios from '../axios';



const getAllRoom = () => {
    return axios.get(`/room`);
}

const createNewRoom = (data) => {
    console.log("Check data: ", data);
    return axios.post('/room', data)
}

const getEditRoom = (id) => {
    return axios.get(`/room/${id}`)
}

const deleteRoomService = (id) => {
    return axios.delete(`/room/${id}`);
}


export {
    getAllRoom,
    createNewRoom,
    getEditRoom,
    deleteRoomService
};