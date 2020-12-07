import axios from 'axios'
import {Message} from 'element-ui'

var api = "/test";
// var api = "/api";

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(api + url, {
      params: params
    })
      .then(response => {
        if (response.data.code === 1) {
           (response.data.data)
        } else {
          Message.error(response.data.msg)
        }
      })
      .catch(err => {
        Message.error(err)
      })
  })
}

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(api + url, data)
      .then(response => {
        if (response.data.code === 1 || response.data.status === 0) {
          if (response.data.result) {
            resolve(response.data.result)
          } else {
            resolve(response.data.data)
          }
        } else {
          if (response.data.message) {
            Message.error(response.data.message)
          } else {
            Message.error(response.data.msg)
          }
        }
      }, err => {
        Message(err)
      })
  })
}
export function getExcel(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(api+ url, {
      params: params,
      responseType: 'blob',
    })
      .then(res => {
        if (!res) {
          return
        }
        let url = window.URL.createObjectURL(res.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'excel.xls')
        document.body.appendChild(link)
        link.click()
      })
      .catch(err => {
        Message.error(err)
      })
  })
}

export function postExcel(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(api + url, data, {responseType: 'blob'})
      .then(res => {
        if (!res) {
          return
        }
        let url = window.URL.createObjectURL(res.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'excel.xls')
        document.body.appendChild(link)
        link.click()
      }, err => {
        Message(err)
      })
  })
}
