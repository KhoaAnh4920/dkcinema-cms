import axios from '../axios';




const createNewPost = (data) => {
    return axios.post('/news', data)
}


const getAllPost = (data) => {
    return axios.get('/get-list-news', data)
}

const getDetailPost = (id) => {
    return axios.get(`/news/${id}`)
}

const editPost = (data) => {
    return axios.put('/news', data)
}


const updateStatusNews = (data) => {
    return axios.put('/status/news', data)
}


const deleteNews = (id) => {
    return axios.delete(`/news/${id}`)
}

const getDetailComment = (data) => {
    return axios.get('/detail/comment', { params: { newsId: data.newsId } })
}

const deleteCommentService = (id) => {
    return axios.delete(`/comment/${id}`);
}



export {
    createNewPost,
    getAllPost,
    getDetailPost,
    editPost,
    updateStatusNews,
    deleteNews,
    getDetailComment,
    deleteCommentService
};