// const API_BASE_URL = 'http://192.168.29.189:3000/'  

// const API_BASE_URL = '  http://192.168.29.238:9292/' 
const API_BASE_URL ='http://192.168.29.244:5000/'

const getEndpoint = text => {
  return API_BASE_URL + text;
};


export const getimage = text => {
  return API_BASE_URL + 'media/' + text;
};


export const createPartner = getEndpoint('partner/create-partner');
export const addVehicle = getEndpoint('partner/add-partner-vehicle');
export const MyVehicle = getEndpoint('partner/vehiclesByPartnerId');
export const addDriverDetails = getEndpoint('drivers/assign-driver-vehicles');















