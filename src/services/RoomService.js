import axios from '../axios';



const getAllRoom = (movieTheaterId) => {
    return axios.get(`/room`, { movieTheaterId });
}

const createNewRoom = (data) => {
    console.log("Check data: ", data);
    return axios.post('/room', data)
}

const updateRoom = (data) => {
    return axios.put('/room', data)
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
    deleteRoomService,
    updateRoom
};