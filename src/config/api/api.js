import { addDriverDetails, addVehicle, cancelOrderurl, createPartner, getDriverDetails, MyVehicle, partnerLogin, partnerOtpVerify, placeOrder, updateOrder, updateWorkStatusurl } from "../url";
import { apiGet, apiPost } from "../utils";


export const hitPartnerLogin = param => {
    return apiPost(partnerLogin, param);
};
export const hitPartnerVerifyOtp = param => {
    return apiPost(partnerOtpVerify, param);
};

export const hitCreatePartner = param => {
    console.log('createPartner', createPartner);
    console.log('param', param);

    return apiPost(createPartner, param);
};

export const hitAddVehicle = param => {

    return apiPost(addVehicle, param);
};

export const hitMyVehicle = param => {
    return apiPost(MyVehicle, param);
};

export const hitAddDriverDetails = param => {

    return apiPost(addDriverDetails, param);
};
export const hitGetDriverDetails = param => {

    return apiPost(getDriverDetails, param);
};


export const hitUpdateDriverStatus = param => {
    return apiPost(updateWorkStatusurl, param);
};

export const hitlPaceOrder = param => {
    console.log('====================================');
    console.log(placeOrder);
    console.log(param);

    console.log('====================================');
    return apiPost(placeOrder, param);
};
export const hitUpdateOrder = param => {
    console.log('====================================');
    console.log(updateOrder);
    console.log(param);

    console.log('====================================');
    return apiPost(updateOrder, param);
};
export const hitCancelOrder = param => {
    console.log('====================================');
    console.log(cancelOrderurl);
    console.log(param);

    console.log('====================================');
    return apiPost(cancelOrderurl, param);
};








