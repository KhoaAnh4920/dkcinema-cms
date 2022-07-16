import axios from '../axios';



const getAllBooking = (movieTheaterId) => {
    return axios.get(`/get-list-booking`, { params: { movieTheaterId: movieTheaterId } });
}

const getDetailBooking = (id) => {
    return axios.get(`/booking/${id}`)
}

const getComboBooking = (id) => {
    return axios.get(`/combo-booking`, { params: { bookingId: id } })
}

const getBookingConfirm = (data) => {
    return axios.get(`/get-list-booking`, { params: { movieTheaterId: data.movieTheaterId, date: data.date, status: data.status, nameCus: data.nameCus, id: data.bookingId } });
}

const getTicketBooking = (id, page, PerPage) => {
    return axios.get(`/ticket/booking`, { params: { bookingId: id, page: page, PerPage: PerPage } })
}





export {
    getAllBooking,
    getDetailBooking,
    getComboBooking,
    getBookingConfirm,
    getTicketBooking
};