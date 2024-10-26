import { configureStore } from '@reduxjs/toolkit';
import hitapi from './HitApis/HitApiSlice';

const store = configureStore({
    reducer: {
        parsalPartner: hitapi, 
    },
});

export default store;
