import axios from '../axios';



const getAllFilms = () => {
    return axios.get(`/movie`);
}

const getAllFilmsByStatus = (status) => {
    return axios.get(`/status/movie`, { params: { status: status } });
}

const getAllTypeFilms = () => {
    return axios.get(`/type-of-movie`);
}

const createNewFilmsService = (data) => {
    return axios.post('/movie', data)
}

const updateFilmsService = (data) => {
    return axios.put('/movie', data)
}

const updateStatusFilms = (data) => {
    return axios.put('/status/movie', data)
}

const getDetailFilm = (movieId) => {
    return axios.get(`/movie/${movieId}`)
}

const removeImageFilm = (id) => {
    return axios.delete(`/image-movie/${id}`)
}

const deleteMovieService = (data) => {
    return axios.put(`/delete/movie`, data)
}


export {
    getAllFilms,
    getAllTypeFilms,
    createNewFilmsService,
    getDetailFilm,
    updateFilmsService,
    removeImageFilm,
    updateStatusFilms,
    deleteMovieService,
    getAllFilmsByStatus
};