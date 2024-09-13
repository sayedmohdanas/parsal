// import React, { useRef } from 'react';
// import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';
// import { useSelector, useDispatch } from 'react-redux';
// import { hideBottomSheet, showBottomSheet } from '../../redux/bottomSheetSlice/bottomSheetSlice';
// import AppImages from '../../common/AppImages';

// const CustomBottomSheet = ({ children }) => {
//     const bottomSheetRef = useRef(null);
//     const dispatch = useDispatch();
//     const isVisible = useSelector((state) => state.bottomSheet.isVisible);

//     const openBottomSheet = () => {
//         bottomSheetRef.current?.expand();
//         dispatch(showBottomSheet());
//     };

//     const closeBottomSheet = () => {
//         bottomSheetRef.current?.close();
//         dispatch(hideBottomSheet());
//     };

//     return (
//         <>
//          <BottomSheet
//             ref={bottomSheetRef}
//             index={isVisible ? 0 : -1} // Use 0 for the first snap point or -1 for closed
//             snapPoints={['30%']} // Adjust snap points as needed
//             enablePanDownToClose={true} // Allow user to swipe down to close
//             backgroundStyle={styles.bottomSheetBackground}
//             onChange={(index) => {
//                 if (index === -1) {
//                     dispatch(hideBottomSheet());
//                 }
//             }}
//         >
//             <View style={styles.bottomSheetContent}>
//                 {children}
//             </View>
//         </BottomSheet>
//          {isVisible && (
//             <TouchableOpacity style={styles.closeButton} onPress={closeBottomSheet}>
//               <Image source={AppImages.closeButton} style={styles.closeImage} resizeMode='contain' />
//             </TouchableOpacity>
//           )}
//         </>
       

//     );
// };

// const styles = StyleSheet.create({
//     bottomSheetBackground: {
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//     },
//     bottomSheetContent: {
//         flex: 1,
//         // width:'100%',

//         justifyContent: 'center',
//         alignItems: 'center',
//         // padding: 16,
//     },
//     closeButton: {
//         backgroundColor: 'white',
//         alignSelf:'center',
//         borderRadius: 5,
//         elevation: 2,
//         // marginTop: 60,
//         padding: 10,
//         top:300,
//         position:"relative"
//     },
//     closeImage: {
//         width: 20,
//         height: 20,
//     },
// });

// export default CustomBottomSheet;
// CustomBottomSheet.js
// CustomBottomSheet.js
// CustomBottomSheet.js



import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { hideBottomSheet } from '../../redux/bottomSheetSlice/bottomSheetSlice';
import AppImages from '../../common/AppImages';
import componentMap from './BottomSheetCards/componentBottomMap/BottomSheetMAp';



const CustomBottomSheet = () => {
  const bottomSheetRef = useRef(null);
  const dispatch = useDispatch();
  const { isVisible, contentType, snapPoints } = useSelector((state) => state.bottomSheet);

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    dispatch(hideBottomSheet());
  };

  const ContentComponent = contentType ? componentMap[contentType] : null;
  console.log('ContentComponent:', ContentComponent); // Add this line


  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={isVisible ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        onChange={(index) => {
          if (index === -1) {
            dispatch(hideBottomSheet());
          }
        }}
      >
        {ContentComponent && <ContentComponent />}
      </BottomSheet>

      {isVisible && (
        <TouchableOpacity style={styles.closeButton} onPress={closeBottomSheet}>
          <Image source={AppImages.closeButton} style={styles.closeImage} resizeMode='contain' />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 2,
  },
  closeImage: {
    width: 20,
    height: 20,
  },
});

export default CustomBottomSheet;
