// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { hitAddDriverDetails, hitAddVehicle, hitCreatePartner, hitMyVehicle } from '../../config/api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage if not already imported


// export const createPartner = createAsyncThunk(
//   'parsalPartner/createPartner',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await hitCreatePartner(credentials);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const addVehicle = createAsyncThunk(
//   'parsalPartner/addVehicle',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await hitAddVehicle(credentials);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const getVehicle = createAsyncThunk(
//   'parsalPartner/getVehicle',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await hitMyVehicle(credentials);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
// export const addDriverDetails = createAsyncThunk(
//   'parsalPartner/addDriverDetails',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await hitAddDriverDetails(credentials);
//       console.log(response)
//       return response;
//     } catch (error) {
//       console.error(error);

//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const initialState = {
//   partner: null,
//   vehicle: [],
//   MyVehicle: [],
//   driver: [],
//   status: 'idle',
//   error: null,
//   loading: false,
// };

// const HitApiSlice = createSlice({
//   name: 'parsalPartner', // Ensure consistency here
//   initialState,
//   reducers: {
//     // Define your reducers here if needed
//   },
//   extraReducers: (builder) => {
//     builder

//     ///createPartner
//       .addCase(createPartner.pending, (state) => {
//         state.status = 'pending';
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createPartner.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.loading = false;
//         state.partner = action.payload;


//         if (action.payload?.partner_id) {
//           savePartnerId(action.payload.partner_id);
//         }

//       })
//       .addCase(createPartner.rejected, (state, action) => {
//         state.status = 'failed';
//         state.loading = false;
//         state.error = action.payload || 'Failed to create partner';
//       })
//       ///addVehicle
//       .addCase(addVehicle.pending, (state) => {
//         state.status = 'pending';
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addVehicle.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.loading = false;
//         state.vehicle = action.payload;
//       })
//       .addCase(addVehicle.rejected, (state, action) => {
//         state.status = 'failed';
//         state.loading = false; // Should be false on failure
//         state.error = action.payload || 'Failed to add vehicle';
//       })

//       ///getVehicle
//       .addCase(getVehicle.pending, (state) => {
//         state.status = 'pending';
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getVehicle.fulfilled, (state, action) => {
//         console.log(action.payload, 'sucess-response')
//         state.status = 'succeeded';
//         state.loading = false;
//         state.MyVehicle = action.payload;
//       })
//       .addCase(getVehicle.rejected, (state, action) => {
//         console.log(action, 'out-put')
//         state.status = 'failed';
//         state.loading = false; // Should be false on failure
//         state.error = action.payload || 'Failed to get vehicle';
//       })

//       ///addDriverdetails
//       .addCase(addDriverDetails.pending, (state) => {
//         state.status = 'pending';
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addDriverDetails.fulfilled, (state, action) => {
//         console.log(action.payload, 'sucess-response')
//         state.status = 'succeeded';
//         state.loading = false;
//         state.driver = action.payload;
//       })
//       .addCase(addDriverDetails.rejected, (state, action) => {
//         console.log(action, 'out-put')
//         state.status = 'failed';
//         state.loading = false; // Should be false on failure
//         state.error = action.payload || 'Failed to get vehicle';
//       });
//   },
// });

// export default HitApiSlice.reducer;



















import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hitAddDriverDetails, hitAddVehicle, hitCreatePartner, hitMyVehicle } from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Thunk for creating a partner and saving partner_id
export const createPartner = createAsyncThunk(
  'parsalPartner/createPartner',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitCreatePartner(credentials);
      // Save partner_id to AsyncStorage
      const parent_id = await AsyncStorage.getItem('partner_id')
      console.log('parent id in slice', parent_id)
      const partnerId = response?.partner_id; // Assuming the response has partner_id
      // await AsyncStorage.setItem('partner_id', partnerId);
      return response;
    } catch (error) {
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

// Thunk for adding vehicle
export const addVehicle = createAsyncThunk(
  'parsalPartner/addVehicle',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitAddVehicle(credentials);
      console.log('=============]]]]]]]]][resposne]]=======================');
      console.log(response);
      console.log('================[resposne]===============');
      return response;
    } catch (error) {
      console.log('=============]]]]]]]]][error]]=======================');

      console.log(error.response);
      console.log('================[error]===============');


      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching vehicle details
export const getVehicle = createAsyncThunk(
  'parsalPartner/getVehicle',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await hitMyVehicle(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for adding driver details
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
  partner: null,
  partnerId: null,
  vehicle: [],
  MyVehicle: [],
  driver: [],
  status: 'idle',
  error: null,
  loading: false,
};

const HitApiSlice = createSlice({
  name: 'parsalPartner',
  initialState,
  reducers: {
    setParentId(state, action) {
      console.log('redux ====> called')
      state.parentId = action.payload; // Set parentId to the value provided in the action payload
      console.log(action.payload, 'set in reux')
    },
  },
  extraReducers: (builder) => {
    builder

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

export const { setParentId } = HitApiSlice.actions;


export default HitApiSlice.reducer;











