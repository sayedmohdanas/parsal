import axios from 'axios';
import { DeviceEventEmitter } from 'react-native';
import { clearCustomerId } from '../common/CommonFunction';
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
        console.log('Error Response:', error.response?.data?.status); // Log the actual response
      //   if (error.response?.data?.status) {
      //     AsyncStorage.setItem("check-user", JSON.stringify(-1));
      // }
      
        console.log('Error Status:', error.response?.status); // Log the status code
        if (error.response) {
          if (error.response.status === 401) {
            // navigation.navigate(-1)
            // console.log(
            //   'Unauthorized - Clearing User Data',
            //   error.response.data,
            // );
            // clearUserData();
            clearCustomerId()
            DeviceEventEmitter.emit("forceLogout");
          } else if (error.response.status === 500) {
            console.log('Server Error - Token Expired', error.response.data);
          }
        } else {
          console.log('Unexpected Error:', error.message);
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

