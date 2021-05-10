import axios from 'axios'

const url = "http://" + location.hostname + ":4000"

const axiosIns = axios.create({
    baseURL: url,
    timeout: 1000,
});

export default axiosIns