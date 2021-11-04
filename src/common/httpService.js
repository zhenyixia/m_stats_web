import axios from 'axios'
import Vue from 'vue'

let baseURL = 'http://localhost:8081';
axios.defaults.baseURL = baseURL;
// Vue.prototype.$http = axios
// let axiosConfig = {
//   baseURL,
//   timeout: 1000
// }

// let instanceTmp = axios.create(axiosConfig)

// export default {
//   getAxios: instanceTmp,
//   getCanceToken: axios.CancelToken
// }

export const getAllUser = (params) => {
  return axios.post('user/getUsers', params).then(res => res.data)
}



// 以下为跑步统计接口

export const getRunList = (params) => {
  return axios.post('run/list', params).then(res => res.data)
}

export const countRunInOneMonth = (params) => {
  return axios.post('run/countInOneMonth', params).then(res => res.data)
}
export const countRunInOneWeek = (params) => {
  return axios.get('run/countInOneWeek?weekIndex=' + params).then(res => res.data)
}
export const countRunInOneYear = (params) => {
  return axios.post('run/countInOneYear', params).then(res => res.data)
}
export const countRunAllYears = () => {
  return axios.get('run/countAllYears').then(res => res.data)
}
// 获取已有的跑步地址
export const getRunAddressed = () => {
  return axios.get('run/getExistedAddress').then(res => res.data)
}

export const addRunData = (params) => {
  return axios.post('run/add', params).then(res => res.data)
}

// 获取年月范围，可能不需要，待删除 -- 2021/2/2
export const getRunYearMonthScope = () => {
  return axios.get('run/getYearMonthScope').then(res => res.data)
}
export const importRunData = axios.defaults.baseURL + '/run/import';

export const downloadRunDataTemplate = axios.defaults.baseURL + '/run/exportFile';

// 未完成，待后台开发
export const exportRunData = (param) => {
  return axios.post('run/export', param, {
    responseType: 'blob'
  }).then(res => res)
}

// 以下为学习统计相关接口
export const getLearnList = (params) => {
  return axios.post('learn/list', params).then(res => res.data)
}

export const countLearnInOneMonth = (params) => {
  return axios.post('learn/countInOneMonth', params).then(res => res.data)
}
export const countLearnInOneYear = (params) => {
  return axios.post('learn/countInOneYear', params).then(res => res.data)
}
export const countLearnAllYears = () => {
  return axios.get('learn/countAllYears').then(res => res.data)
}
// 获取已有的学习内容
export const getLearnContent = () => {
  return axios.get('learn/getExistedContent').then(res => res.data)
}

export const countLearnInOneWeek = (param1,param2) => {
  return axios.get('learn/countWeek?weekIndex=' + param1 + '&learnContent=' + param2).then(res => res.data)
}

export const addLearnData = (params) => {
  return axios.post('learn/add', params).then(res => res.data)
}
