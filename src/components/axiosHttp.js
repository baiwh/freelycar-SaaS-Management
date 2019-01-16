import axios from 'axios'
import {Message} from 'element-ui'

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get('/api' + url, {
      params: params
    })
      .then(response => {
        if (response.data.code === 1) {
          resolve(response.data.data)
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
    axios.post('/api' + url, data)
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
