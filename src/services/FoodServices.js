import axios from '../axios';



const getAllFoods = (typeId) => {
    return axios.get(`/get-list-food`, { params: { typeId: typeId } });
}


const getAllTypeFood = () => {
    return axios.get(`/type-of-food`);
}

const createNewFoodService = (data) => {
    return axios.post('/food', data)
}

const getEditFood = (id) => {
    return axios.get(`/food/${id}`)
}

const editFoodService = (data) => {
    return axios.put('/food', data)
}

const deleteFoodService = (id) => {
    return axios.delete(`/food/${id}`);
}



export {
    getAllFoods,
    getAllTypeFood,
    createNewFoodService,
    getEditFood,
    editFoodService,
    deleteFoodService
};