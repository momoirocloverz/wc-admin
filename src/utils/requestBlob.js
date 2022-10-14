import axios from 'axios'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let token=sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(  
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
