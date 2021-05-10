import axios from 'axios'

const url = "http://" + location.hostname + "/node"

const axiosIns = axios.create({
    baseURL: url,
    timeout: 1000,
});

export default axiosIns