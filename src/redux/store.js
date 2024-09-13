// import { configureStore } from '@reduxjs/toolkit';
// import hitapi from './HitApis/HitApiSlice';

// const store = configureStore({
//     reducer: {
//         parsalPartner: hitapi, 
//     },
// });

// export default store;
import { configureStore } from '@reduxjs/toolkit';
import hitapi from './HitApis/HitApiSlice';
import bottomSheetReducer from './bottomSheetSlice/bottomSheetSlice';

const store = configureStore({
    reducer: {
        parsalPartner: hitapi,
        bottomSheet: bottomSheetReducer,
    },
});

export default store;
