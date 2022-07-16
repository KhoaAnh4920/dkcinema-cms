import axios from '../axios';



const getListFeedback = (data) => {
    console.log("Check data: ", data);
    if (!data)
        return axios.get(`/get-list-feedback`);
    return axios.get(`/get-list-feedback`, { params: { key: data.key, startTime: data.startTime, endTime: data.endTime } });
}


const getDetailFeedback = (id) => {
    return axios.get(`/feedback/${id}`)
}


export {
    getListFeedback,
    getDetailFeedback
};