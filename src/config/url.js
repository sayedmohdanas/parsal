// const API_BASE_URL = 'http://192.168.29.189:4000/'

//  export const API_BASE_URL = 'http://192.168.29.238:9292/'

// export const API_BASE_URL = `http://192.168.29.244:5000/`;
// export const socketUrl = `http://192.168.29.244:4000/`;

//
export const API_BASE_URL = 'http://52.66.236.213:9292/';
export const socketUrl = `http://52.66.236.213:4000/`;
// export const API_BASE_URL = 'http://192.168.29.237:5000/';
// export const socketUrl = `http://192.168.29.237:4000/`;

//
const getEndpoint = text => {
  return API_BASE_URL + text;
};

export const getimage = text => {
  return API_BASE_URL + 'media/' + text;
};

// export const partnerLogin= getEndpoint('partner/login')

export const partnerLogin = getEndpoint('partner/owner-login');
export const partnerOtpVerify = getEndpoint('partner/verifyOtp');
export const createPartner = getEndpoint('partner/create-partner');
export const getPartner = getEndpoint('partner/getPartnerById');
export const addVehicle = getEndpoint('partner/add-partner-vehicle');
export const deleteVehicle = getEndpoint('partner/delete-partner-vehicle');
export const MyVehicle = getEndpoint('partner/vehiclesByPartnerId');
export const addBankAccount = getEndpoint('partner/addBankDetails');
export const getBankAccount = getEndpoint('partner/bank-details');
export const partnerDriversurl = getEndpoint('partner/get-partner-drivers');
export const getLedger = getEndpoint('partner/get-partner-ledger');
// export const getLedger = getEndpoint('partner/get-partnerDrivers');

//driver
export const addDriverDetails = getEndpoint('drivers/assign-driver-vehicles');
export const updateDriverDetails = getEndpoint('drivers/edit-driver-profile');

export const deleteDriverDetails = getEndpoint(
  'drivers/delete-driver-vehicles',
);
export const getDriverDetails = getEndpoint('drivers/get-driver-details');
export const updateWorkStatusurl = getEndpoint('drivers/update-location');
export const placeOrder = getEndpoint('users/place-order');
export const updateOrder = getEndpoint('orders/updateOrder-isPickup');
export const getOrderDetail = getEndpoint('orders/get-order-details');
export const cancelOrderurl = getEndpoint('orders/cancel-order');
// export const driverEaring =getEndpoint('orders/cancel-order');
export const driverEaringurl = getEndpoint('orders/driver-payments');
export const updateDriverDistanceurl = getEndpoint(
  'users/update-driver-distance',
);
export const createtransactionurl = getEndpoint('users/create-transaction');
export const livedriverOfPartnernurl = getEndpoint(
  'drivers/get-live-driverOfPartner',
);
export const getallvehicletypeurl = getEndpoint('generic/get-all-VehicleType');
export const reviewTermsAndCondition = getEndpoint(
  'generic/get-terms-condition',
);
export const getTickeReply = getEndpoint('generic/get-tickets-reply');
export const addTickeReply = getEndpoint('generic/add-tickets-reply');
export const getNotification = getEndpoint('generic/get-notifications');
export const getDoctypes = getEndpoint('generic/get-all-doctypes');
export const getwalletbalanceurl = getEndpoint('drivers/wallet-balance');
export const addMoney = getEndpoint('drivers/wallet-deposit');
export const withrawMoney = getEndpoint('drivers/wallet-withdraw');
export const updateDriverLocationurl = getEndpoint(
  'orders/update-driverLocation',
);
export const getliveorderdataurl = getEndpoint('orders/get-ongoing-order');
export const updatefcmurl = getEndpoint('drivers/update-fcm');
export const helpAndSupport = getEndpoint('generic/support-ticket');
export const getSupportTickets = getEndpoint('generic/get-support-tickets');
export const getOrderFareDetail = getEndpoint('users/get-order-fareDetails');
export const editpartnervehicleurl = getEndpoint(
  'partner/edit-partner-vehicle',
);
export const deleteNotificationurl = getEndpoint(
  'generic/delete-user-notifications',
);
export const updateotppurl = getEndpoint('orders/update-order-otp');
export const endtripurl = getEndpoint('orders/endRide');
export const driverarriveurl = getEndpoint('orders/driverArrived');
export const getOrdersById = getEndpoint('orders/get-order-by-customer');
export const userorderstatsurl = getEndpoint('users/get-cust-orderStats');

export const transactionurl = getEndpoint('drivers/driver-transaction');
export const checkreqstatusurl = getEndpoint('drivers/check-requestId');
export const assignPartnerDriverToVehicleurl = getEndpoint(
  'drivers/assignPartnerDriverToVehicle',
);
export const getDriverTodaysEarningurl = getEndpoint(
  'drivers/getDriverTodaysEarning',
);
