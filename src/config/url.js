// const API_BASE_URL = 'http://192.168.29.189:4000/'  

//  export const API_BASE_URL = 'http://192.168.29.238:9292/' 

export const API_BASE_URL =`http://192.168.29.244:5000/`
export  const socketUrl= `http://192.168.29.244:4000/`


// // 
// export const API_BASE_URL ='http://52.66.236.213:9292/'
// export  const socketUrl= `http://52.66.236.213:4000/`


// 
const getEndpoint = text => {
  return API_BASE_URL + text;
};

export const getimage = text => {
  return API_BASE_URL + 'media/' + text;
};

// export const partnerLogin= getEndpoint('partner/login')

export const partnerLogin= getEndpoint('partner/owner-login')
export const partnerOtpVerify= getEndpoint('partner/verifyOtp')
export const createPartner = getEndpoint('partner/create-partner');
export const getPartner = getEndpoint('partner/getPartnerById');
export const addVehicle = getEndpoint('partner/add-partner-vehicle');
export const MyVehicle = getEndpoint('partner/vehiclesByPartnerId');
export const addBankAccount=getEndpoint('partner/addBankDetails');
export const getBankAccount =getEndpoint('partner/bank-details');
export const addDriverDetails = getEndpoint('drivers/assign-driver-vehicles');
export const getDriverDetails = getEndpoint('drivers/get-driver-details');
export const updateWorkStatusurl = getEndpoint('drivers/update-location');
export const placeOrder=getEndpoint('users/place-order');
export const updateOrder=getEndpoint('orders/updateOrder-isPickup');
export const cancelOrderurl =getEndpoint('orders/cancel-order');
export const driverEaring =getEndpoint('orders/cancel-order');



















