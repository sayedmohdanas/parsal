import {
  addBankAccount,
  addDriverDetails,
  addVehicle,
  cancelOrderurl,
  createPartner,
  createtransactionurl,
  driverEaring,
  driverEaringurl,
  getallvehicletypeurl,
  getBankAccount,
  getDriverDetails,
  getPartner,
  livedriverOfPartnernurl,
  MyVehicle,
  partnerLogin,
  partnerOtpVerify,
  placeOrder,
  updateDriverDistanceurl,
  updateOrder,
  updateWorkStatusurl,
} from '../url';
import {apiGet, apiPost} from '../utils';

export const hitPartnerLogin = param => {
  return apiPost(partnerLogin, param);
};
export const hitPartnerVerifyOtp = param => {
  return apiPost(partnerOtpVerify, param);
};

export const hitCreatePartner = param => {
  return apiPost(createPartner, param);
};
export const hitGetPartner = param => {
  return apiPost(getPartner, param);
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
  return apiPost(placeOrder, param);
};
export const hitUpdateOrder = param => {
  return apiPost(updateOrder, param);
};
export const hitCancelOrder = param => {
  return apiPost(cancelOrderurl, param);
};

export const hitAddBankAccount = param => {
  return apiPost(addBankAccount, param);
};
export const hitGetBankAccount = param => {
  return apiPost(getBankAccount, param);
};
export const hitDriverEarning = param => {
  return apiPost(driverEaringurl, param);
};
export const hitUpdateDriverLocation = param => {
  return apiPost(updateDriverDistanceurl, param);
};
export const hitCreateTransaction = param => {
  return apiPost(createtransactionurl, param);
};
export const hitGetLiveDriverofPartner = param => {
  return apiPost(livedriverOfPartnernurl, param);
};
export const hitGetAllVehicleTypeApi = param => {
  return apiGet(getallvehicletypeurl, param);
};
