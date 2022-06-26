import axios from '../axios';



const getAllSchedule = (data) => {
    return axios.get(`/get-list-schedule`, { params: { date: data.date, roomId: data.roomId, movieId: (data.movieId && data.movieId > 0) ? data.movieId : null } });
}


const createNewScheduleService = (data) => {
    return axios.post('/schedule-movie', data)
}

export {
    getAllSchedule,
    createNewScheduleService
};