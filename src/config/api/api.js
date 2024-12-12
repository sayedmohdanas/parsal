import {
  addBankAccount,
  addDriverDetails,
  addMoney,
  addTickeReply,
  addVehicle,
  assignPartnerDriverToVehicleurl,
  cancelOrderurl,
  checkreqstatusurl,
  createPartner,
  createtransactionurl,
  deleteDriverDetails,
  deleteNotificationurl,
  deleteVehicle,
  driverarriveurl,
  driverEaring,
  driverEaringurl,
  editpartnervehicleurl,
  endtripurl,
  getallvehicletypeurl,
  getBankAccount,
  getDriverDetails,
  getDriverTodaysEarningurl,
  getLedger,
  getliveorderdataurl,
  getNotification,
  getOrderDetail,
  getOrderFareDetail,
  getOrdersById,
  getPartner,
  getSupportTickets,
  getTickeReply,
  getwalletbalanceurl,
  helpAndSupport,
  livedriverOfPartnernurl,
  MyVehicle,
  partnerDriversurl,
  partnerLogin,
  partnerOtpVerify,
  placeOrder,
  reviewTermsAndCondition,
  transactionurl,
  updateDriverDetails,
  updateDriverDistanceurl,
  updateDriverLocationurl,
  updatefcmurl,
  updateOrder,
  updateotppurl,
  updateWorkStatusurl,
  userorderstatsurl,
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
  return apiPost(deleteVehicle, param);
};

export const hitMyVehicle = param => {
  return apiPost(MyVehicle, param);
};

export const hitAddDriverDetails = param => {
  return apiPost(addDriverDetails, param);
};
export const hitUpdateDriverDetails = param => {
  return apiPost(updateDriverDetails, param);
};
export const hitDeleteDriverDetails = param => {
  return apiPost(deleteDriverDetails, param);
};
export const hitGetDriverDetails = param => {
  return apiPost(getDriverDetails, param);
};
export const hitGetPartnerDriverApi = param => {
  return apiPost(partnerDriversurl, param);
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
export const hitUpdateDriverLocationApi = param => {
  return apiPost(updateDriverLocationurl, param);
};

export const hitGetLiveOrderApi = param => {
  return apiPost(getliveorderdataurl, param);
};
export const hitUpdateFcmApi = param => {
  return apiPost(updatefcmurl, param);
};

export const hitAddTicketReply = param => {
  return apiPost(addTickeReply, param);
};
export const hitGetTicketReply = param => {
  return apiPost(getTickeReply, param);
};
export const hitEditParnterVehicle = param => {
  return apiPost(editpartnervehicleurl, param);
};

export const hitHelpAndSupport = param => {
  return apiPost(helpAndSupport, param);
};
export const hitGetSupportTicket = param => {
  return apiPost(getSupportTickets, param);
};
export const hitDeleteNotificationApi = param => {
  return apiPost(deleteNotificationurl, param);
};
export const hitUpdateOrderOtpApi = param => {
  return apiPost(updateotppurl, param);
};
export const hitGetOrderFareDetail = param => {
  return apiPost(getOrderFareDetail, param);
};
export const hitEndOrderApi = param => {
  return apiPost(endtripurl, param);
};
export const hitDriverArrivedApi = param => {
  return apiPost(driverarriveurl, param);
};

export const hitOrderListApi = param => {
  return apiPost(getOrdersById, param);
};
export const hitGetUserOrderStatsApi = param => {
  return apiPost(userorderstatsurl, param);
};

export const hitGetTransactionListApi = param => {
  return apiPost(transactionurl, param);
};

export const hitCheckReqStatusApi = param => {
  return apiPost(checkreqstatusurl, param);
};
export const hitPartnerDriverToVehicleurlApi = param => {
  return apiPost(assignPartnerDriverToVehicleurl, param);
};

export const hitGetgetLedger = param => {
  return apiPost(getLedger, param);
};
export const hitgetDriverTodaysEarningApi = param => {
  return apiPost(getDriverTodaysEarningurl, param);
};
