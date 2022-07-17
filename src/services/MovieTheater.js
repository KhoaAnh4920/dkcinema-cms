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


export {
    getAllMovieTheater,
    createNewMovieTheater,
    getEditMovieTheater,
    editMovieTheater,
    removeImageMovieTheater,
    checkMerchantMovieTheater,
    getTheaterSales
};