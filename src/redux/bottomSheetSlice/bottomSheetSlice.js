// bottomSheetSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

const bottomSheetSlice = createSlice({
  name: 'bottomSheet',
  initialState: {
    isVisible: false,
    contentType: null,
    snapPoints: ['30%'],
  },
  reducers: {
    showBottomSheet: (state, action) => {
      Alert.alert('from redux')
      state.isVisible = true;
      state.contentType = action.payload.contentType;
      state.snapPoints = action.payload.snapPoints || ['30%'];
    },
    hideBottomSheet: (state) => {
      state.isVisible = false;
      state.contentType = null;
    },
    toggleBottomSheet: (state) => {
      state.isVisible = !state.isVisible;
    },
  },
});

export const { showBottomSheet, hideBottomSheet, toggleBottomSheet } = bottomSheetSlice.actions;

export default bottomSheetSlice.reducer;
