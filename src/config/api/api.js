import { addBankAccount, addDriverDetails, addVehicle, cancelOrderurl, createPartner, driverEaring, getBankAccount, getDriverDetails, getPartner, MyVehicle, partnerLogin, partnerOtpVerify, placeOrder, updateOrder, updateWorkStatusurl } from "../url";
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
export const hitGetPartner = param => {
    console.log('createPartner', getPartner);
    console.log('param', param);

    return apiPost(getPartner, param);
};

export const hitAddVehicle = param => {

    return apiPost(addVehicle, param);
};

export const hitMyVehicle = param => {
    return apiPost(MyVehicle, param);
};

export const hitAddDriverDetails = param => {
    console.log('====================================');
    console.log(addDriverDetails);
    console.log(param);
    console.log('====================================');

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

export const hitAddBankAccount = param => {
    console.log('====================================');
    console.log(addBankAccount);
    console.log(param);

    console.log('====================================');
    return apiPost(addBankAccount, param);
};
export const hitGetBankAccount = param => {
    console.log('====================================');
    console.log(getBankAccount);
    console.log(param);

    console.log('====================================');
    return apiPost(getBankAccount, param);
};
export const hitDriverEarning = param => {
    console.log('====================================');
    console.log(driverEaring);
    console.log(param);

    console.log('====================================');
    return apiPost(driverEaring, param);
};







