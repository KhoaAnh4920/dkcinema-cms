import axios from '../axios';



const getAllMovieTheater = () => {
    return axios.get(`/get-list-movieTheater`);
}


const createNewMovieTheater = (data) => {
    return axios.post('/movieTheater', data)
}

const editMovieTheater = (data) => {
    return axios.put('/movieTheater', data)
}


const getEditMovieTheater = (movieTheaterId) => {
    return axios.get(`/movieTheater/${movieTheaterId}`)
}

const removeImageMovieTheater = (id) => {
    return axios.delete(`/image-movie-theater/${id}`)
}

const checkMerchantMovieTheater = (data) => {
    return axios.get(`/check-merchant-movieTheater`, { params: { movieTheaterId: data.movieTheaterId, roleId: data.roleId } });
}

const getTheaterSales = (data) => {
    return axios.get(`/count-turnover-of-movieTheater`, { params: { movieTheaterId: data.movieTheaterId } });
}

const deleteMovieTheater = (id) => {
    return axios.delete(`/movieTheater/${id}`)
}

const countRoomMovieTheater = (id) => {
    return axios.get(`/count-room-of-movieTheater`, { params: { movieTheaterId: id } })
}


const counTicketMovieTheater = (id, time) => {
    return axios.get(`/count-ticket-by-movieTheater`, { params: { movieTheaterId: id, time: time } })
}


const getEachTheaterRevenue = (id, type) => {
    return axios.get(`/get-each-theater-revenue`, { params: { movieTheaterId: id, type: type } })
}




export {
    getAllMovieTheater,
    createNewMovieTheater,
    getEditMovieTheater,
    editMovieTheater,
    removeImageMovieTheater,
    checkMerchantMovieTheater,
    getTheaterSales,
    deleteMovieTheater,
    countRoomMovieTheater,
    counTicketMovieTheater,
    getEachTheaterRevenue
};