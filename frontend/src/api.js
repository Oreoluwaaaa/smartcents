import axios from 'axios';

//setting url
const API = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        Authorization: localStorage.getItem('token')
    }
});

export default API;
