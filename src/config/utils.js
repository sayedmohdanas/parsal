import axios from 'axios';

export async function apiReq(
  endPoint,
  data,
  method,
  headers,
  requestOptions = {},
) {
  return new Promise(async (res, rej) => {
    // const getTokenHeader = await getHeaders();
    headers = {
      // ...getTokenHeader,
      ...headers,
    };

    axios[method](
      endPoint,
      //   {fight_zone: data},
      data,
      { headers: { 'Content-Type': 'application/json' } },
    )

      .then(result => {
        const { data } = result;
        if (data.status === false) {

          return rej(data);
        }

        return res(data);
      })
      .catch(error => {
        console.log('In utils.js in catch, Err =>', error.message, error)
        if (error && error.response && error.response.status === 401) {
          // clearUserData();
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.message || 'Network Error',
            });
          }
          return rej(error.response.data);
        } else {
          return rej({ message: 'Network Error', msg: 'Network Error' });
        }
      });
  });
}

export function apiPost(endPoint, data) {
  return apiReq(endPoint, data, 'post');
}

export function apiDelete(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, 'delete', headers);
}

export function apiGet(
  endPoint,
  data,
  headers = {
    // 'app-id': '6435741cf7c671412bf21c13',
  },
  requestOptions,
) {
  return apiReq(endPoint, data, 'get', headers, requestOptions);
}

export function apiPut(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, 'put', headers);
}

