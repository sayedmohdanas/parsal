import {
  addBankAccount,
  addDriverDetails,
  addMoney,
  addVehicle,
  cancelOrderurl,
  createPartner,
  createtransactionurl,
  deleteDriverDetails,
  deleteVehicle,
  driverEaring,
  driverEaringurl,
  getallvehicletypeurl,
  getBankAccount,
  getDriverDetails,
  getNotification,
  getOrderDetail,
  getPartner,
  getwalletbalanceurl,
  livedriverOfPartnernurl,
  MyVehicle,
  partnerLogin,
  partnerOtpVerify,
  placeOrder,
  reviewTermsAndCondition,
  updateDriverDetails,
  updateDriverDistanceurl,
  updateOrder,
  updateWorkStatusurl,
  withrawMoney,
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
export const hitDeleteVehicle = param => {
  console.log(param,'paramfromdelete')

  return apiPost(deleteVehicle, param);
};

export const hitMyVehicle = param => {
  return apiPost(MyVehicle, param);
};

export const hitAddDriverDetails = param => {
  return apiPost(addDriverDetails, param);
};
export const hitUpdateDriverDetails = param => {
  console.log('param-from-add-driver-page',param)
  return apiPost(updateDriverDetails, param);
};
export const hitDeleteDriverDetails = param => {
  console.log(param,'paramfromdelete')
  return apiPost(deleteDriverDetails, param);
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
export const hitGetOrderDetails = param => {
  return apiPost(getOrderDetail, param);
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

export const hitReviewTermsAndCondition = param => {
  return apiPost(reviewTermsAndCondition, param);
};
export const hitGetNotification = param => {
  return apiPost(getNotification, param);
};
export const hitGetWalletBalanceApi = param => {
  return apiPost(getwalletbalanceurl, param);
};
export const hitAddMoney = param => {
  return apiPost(addMoney, param);
};

export const hitAddWithraw = param => {
  return apiPost(withrawMoney, param);
};