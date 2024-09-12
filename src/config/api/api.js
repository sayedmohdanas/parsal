import {addDriverDetails, addVehicle, createPartner, MyVehicle } from "../url";
import { apiGet, apiPost } from "../utils";

export const hitCreatePartner = param => {
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









