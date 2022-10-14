import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let token=sessionStorage.getItem('token');
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
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
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code !== undefined) {
      if (res.code === 0) {
        return res
      }
      if(res.code===21001){
        location.href='/login';
      }
      // throw new Error(res.msg)
      return Message({
        message:res.msg,
        type:'error',
        duration:2000
      })
    }
    // return response
  },
  error => {
    // console.log('错误' + error) // for debug
    if (error.message.includes('timeout')) {
      Message({
        message: '请求超时，请稍后重试',
        type: 'error',
        duration: 2000
      })
    }

    return Promise.reject(error)
  }
)

export default service
