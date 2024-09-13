// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { responsiveFontSize } from './metrices';
import { useDispatch } from 'react-redux';

// export function setItem(key, data) {
//     data = JSON.stringify(data);
//     // return AsyncStorage.setItem(key, data);
// }

// export function getItem(key) {
//     return new Promise((resolve, reject) => {
//         AsyncStorage.getItem(key).then(data => {
//             resolve(JSON.parse(data));
//         });
//     });
// }
export const successToast = (text1, text2 = '') => {
    Toast.show({
        type: 'success',
        text1: text1,
        text2: text2,
        position: 'top',
        autoHide: true,
        visibilityTime: 4000,
        text1Style: { fontSize: 16 },
        text2Style: { fontSize: 13},
    });
};

export const errorToast = (text1, text2 = '') => {
    Toast.show({
        type: 'error',
        text1: text1,
        text2: text2,
        position: 'top',
        autoHide: true,
        visibilityTime: 4000,
     text1Style: { fontSize: 16 },
     text2Style: { fontSize: 16 },
    });
};

export const infoToast = (text1, text2 = '') => {
    Toast.show({
        type: 'info',
        text1: text1,
        text2: text2,
        position: 'top',
        autoHide: true,
        visibilityTime: 4000,
        text1Style: { fontSize: responsiveFontSize(16) },
        text2Style: { fontSize: responsiveFontSize(13) },
    });
};

export const customToast = (text1, text2 = '', config = {}) => {
    Toast.show({
        type: 'custom',
        text1: text1,
        text2: text2,
        position: 'top',
        autoHide: true,
        visibilityTime: 4000,
        text1Style: { fontSize: responsiveFontSize(16) },
        text2Style: { fontSize: responsiveFontSize(13) },
        ...config, // Any custom configurations can be passed here
    });
}
