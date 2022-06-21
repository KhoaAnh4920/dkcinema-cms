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


export {
    getAllMovieTheater,
    createNewMovieTheater,
    getEditMovieTheater,
    editMovieTheater,
    removeImageMovieTheater
};