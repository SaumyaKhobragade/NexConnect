import axios from 'axios';

const clientServer = axios.create({
    baseURL: 'http://localhost:8000',
});

export default clientServer;
