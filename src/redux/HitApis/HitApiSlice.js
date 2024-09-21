import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hitAddDriverDetails, hitAddVehicle, hitCreatePartner, hitMyVehicle, hitPartnerLogin, hitPartnerVerifyOtp } from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { errorToast } from '../../common/CommonFunction';





// loginPartner.....

export const loginPartner = createAsyncThunk(
  'parsalPartner/loginPartner',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitPartnerLogin(credentials);
      console.log(response, 'response--------');

      // const parent_id = await AsyncStorage.getItem('partner_id')

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// partnerOtpVerify...
export const verifyPartnerOtp = createAsyncThunk(
  'parsalPartner/verifyPartnerOtp',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitPartnerVerifyOtp(credentials);
      console.log(response, 'response--------');

      // const parent_id = await AsyncStorage.getItem('partner_id')

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);





// Thunk for creating a partner and saving partner_id
export const createPartner = createAsyncThunk(
  'parsalPartner/createPartner',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitCreatePartner(credentials);


      // const parent_id = await AsyncStorage.getItem('partner_id')

      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
// Thunk for getting partner_id from AsyncStorage
export const getPartnerId = createAsyncThunk(
  'parsalPartner/getPartnerId',
  async (_, { rejectWithValue }) => {
    try {
      const partnerId = await AsyncStorage.getItem('partner_id');
      if (partnerId !== null) {

        return partnerId;
      }
      throw new Error('No partner_id found');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addVehicle = createAsyncThunk(
  'parsalPartner/addVehicle',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitAddVehicle(credentials);

      return response;
    } catch (error) {



      return rejectWithValue(error.response.data);
    }
  }
);


export const getVehicle = createAsyncThunk(
  'parsalPartner/getVehicle',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitMyVehicle(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addDriverDetails = createAsyncThunk(
  'parsalPartner/addDriverDetails',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitAddDriverDetails(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  partner: null,
  partnerId: null,
  vehicle: [],
  MyVehicle: [],
  driver: [],
  status: 'idle',
  error: null,
  loading: false,
  driverId: null
};

const HitApiSlice = createSlice({
  name: 'parsalPartner',
  initialState,
  reducers: {
    setParentId(state, action) {
      state.partnerId = action.payload; 
    },
    setMyVehicleData(state,action){
      state.MyVehicle = action.payload.vehicles;
    },
    setDriverId(state, action){
      state.driverId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder

      // login user
      .addCase(loginPartner.pending, (state) => {
        state.status = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(loginPartner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.user = action.payload;
        console.log(action.payload,'formhook')

      })
      .addCase(loginPartner.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload || 'Failed to create partner';
      })

      // createPartner case to save partner info and partner_id
      .addCase(createPartner.pending, (state) => {
        state.status = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(createPartner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.partner = action.payload;

      })
      .addCase(createPartner.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload || 'Failed to create partner';
      })

      // getPartnerId case to retrieve partner_id from AsyncStorage
      .addCase(getPartnerId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartnerId.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerId = action.payload;
      })
      .addCase(getPartnerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get partner_id';
      })

      // addVehicle cases
      .addCase(addVehicle.pending, (state) => {
        state.status = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.vehicle = action.payload;
        // state.vehicle = action.payload.vehicles || [];

      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload || 'Failed to add vehicle';
      })

      // getVehicle cases
      .addCase(getVehicle.pending, (state) => {
        state.status = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(getVehicle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.MyVehicle = action.payload.vehicles.reverse();
      })
      .addCase(getVehicle.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload || 'Failed to get vehicle';
      })

      // addDriverDetails cases
      .addCase(addDriverDetails.pending, (state) => {
        state.status = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(addDriverDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.driver = action.payload;
      })
      .addCase(addDriverDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload || 'Failed to add driver details';
      });
  },
});

export const { setParentId,setMyVehicleData, setDriverId } = HitApiSlice.actions;


export default HitApiSlice.reducer;











