import { addDriverDetails, addVehicle, createPartner, MyVehicle, partnerLogin, partnerOtpVerify, updateWorkStatusurl } from "../url";
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
    console.log('====================================');
    console.log(MyVehicle);
    console.log(param);

    console.log('====================================');
    return apiPost(MyVehicle, param);
};

export const hitAddDriverDetails = param => {

    return apiPost(addDriverDetails, param);
};

export const hitUpdateDriverStatus = param => {
    return apiPost(updateWorkStatusurl, param);
};









