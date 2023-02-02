import axios from "axios";
const baseUrl = '/api/persons';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(request => request.data);
}

const create = (newPerson) => {
    const request = axios.post(baseUrl, newPerson);
    return request.then(request => request.data);
}

const update = (id, newPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, newPerson);
    return request.then(request => request.data);
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(request => request.data);
}

export default { getAll, create, update, remove };