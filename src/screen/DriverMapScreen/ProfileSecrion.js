// import React, { useState } from 'react';
// import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import AppImages from '../../common/AppImages';
// import Colors from '../../common/Colors';

// const ProfileSection = () => {
//     const [otp, setOtp] = useState('');

//     const handleOtpSubmit = () => {
//         console.log('OTP Submitted:', otp);
//     };

//     return (
//         <View style={styles.profileContainer}>
//             {/* OTP Section */}
//             <View style={styles.otpSection}>
//                 <Text style={styles.otpLabel}>Enter OTP:</Text>
//                 <TextInput
//                     style={styles.otpInput}
//                     value={otp}
//                     onChangeText={setOtp}
//                     placeholder="Enter OTP"
//                     keyboardType="numeric"
//                 />
//                 <TouchableOpacity style={styles.otpButton} onPress={handleOtpSubmit}>
//                     <Text style={styles.otpButtonText}>Submit OTP</Text>
//                 </TouchableOpacity>
//             </View>

//              <View style={{backgroundColor:"blue",flex:1,gap:5}}>
//             <View style={styles.profileDetails}>
//                 <View style={styles.ProfileView}>
//                     <Image source={AppImages.dhoniImage} style={styles.profileImage} />
//                     <View style={styles.details}>
//                         <Text style={styles.name}> Ms Dhoni</Text>
//                     </View>
//                 </View>
//                 <View style={styles.centeredView}>
//                     <View style={{borderLeftWidth:2,borderLeftColor:'green',width:20}}></View>
//                     <Text style={styles.name}>Khurram Namar</Text>
//                     <Text style={styles.name}>Charbagh</Text>
//                 </View>

//                 <View style={styles.actions}>
//                     <TouchableOpacity style={styles.actionButton}>
//                         <Image source={AppImages.callImage} style={styles.iconImage} />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.actionButton}>
//                         <Image source={AppImages.cancelImage} style={styles.iconImage} />
//                     </TouchableOpacity>
                    
//                 </View>
//                 <View style={{ alignSelf: 'center', backgroundColor: 'pink', flexDirection: 'row',gap:10}}>
//                 <View style={{ flexDirection: 'row' ,borderRightWidth:2,borderRightColor:Colors.brandBlue}} >
//                     <Text style={{fontSize:16,fontWeight:'600',color:Colors.black
//                     }}>Electrical Item</Text>
//                 </View>
//                 <View style={{ flexDirection: 'row' }} >
//                     <Text style={{fontSize:16,fontWeight:'600',color:Colors.black}}>1 kg</Text>
//                 </View>

//             </View>

//             </View>
        
           
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     profileContainer: {
//         backgroundColor: 'white',
//         position: 'absolute',
//         bottom: 0,
//         width: '100%',
//         padding: 8,
//         height: '30%',
//     },
//     otpSection: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//         borderBottomColor: 'gray',
//         borderBottomWidth: 0.5,
//     },
//     otpLabel: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginRight: 10,
//         color: 'black',
//     },
//     otpInput: {
//         borderWidth: 1,
//         borderColor: 'gray',
//         padding: 10,
//         borderRadius: 8,
//         flex: 1,
//         marginRight: 10,
//     },
//     otpButton: {
//         backgroundColor: 'blue',
//         padding: 10,
//         borderRadius: 8,
//     },
//     otpButtonText: {
//         color: 'white',
//         fontWeight: 'bold',
//     },
//     profileDetails: {
//         flexDirection: 'row',
//         flexWrap:'wrap',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: 'red',
//         height:'100%'
//     },
//     centeredView: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'gray'
//     },
//     ProfileView: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'aqua',
//         // paddingBottom: 30
//     },
//     profileImage: {
//         width: 70,
//         height: 70,
//         borderRadius: 100,

//     },
//     iconImage: {
//         width: 25, // Reduced size for the call/cancel images
//         height: 25,
//     },
//     details: {
//         flex: 1,
//         marginLeft: 15,
//     },
//     name: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: 'black',
//     },
//     actions: {
//         flexDirection: 'column',
//         gap: 10,
//     },
//     callButton: {
//         backgroundColor: 'green',
//         padding: 10,
//         borderRadius: 5,
//         marginRight: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     actionButton: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: Colors.splashWhite,
//         padding: 10,
//         borderRadius: 80,
//     },
//     actionText: {
//         color: 'white',
//         fontWeight: 'bold',
//         marginLeft: 5,
//     },
// });

// export default ProfileSection;





import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import BorderLine from '../../common/BorderLine.';

const ProfileSection = () => {
    const [otp, setOtp] = useState('');

    const handleOtpSubmit = () => {
        console.log('OTP Submitted:', otp);
    };

    return (
        null
        // <View style={styles.profileContainer}>
        //     {/* OTP Section */}
        //     <View style={{width:'100%'}}>
        //     <View style={styles.otpSection}>
        //         <Text style={styles.otpLabel}>Enter OTP:</Text>
        //         <TextInput
        //             style={styles.otpInput}
        //             value={otp}
        //             onChangeText={setOtp}
        //             placeholder="Enter OTP"
        //             keyboardType="numeric"
        //         />
        //         <TouchableOpacity style={styles.otpButton} onPress={handleOtpSubmit}>
        //             <Text style={styles.otpButtonText}>Submit OTP</Text>
        //         </TouchableOpacity>
        //         </View>
        //         <BorderLine color="gray" thickness={3} length="100%" orientation="horizontal" />
        //         </View>

        //     <View style={styles.mainContent}>
        //         {/* Left Side (Profile) */}
        //         <View style={styles.ProfileView}>
        //             <Image source={AppImages.profileImage} style={styles.profileImage} />
        //             <Text style={styles.name}>Ms Dhoni</Text>
        //         </View>

        //         {/* Centered View with Left-aligned Vertical Line */}
        //         <View style={styles.centeredView}>
        //             <View style={styles.leftAligned}>
        //                 <View style={styles.verticleLine}></View>
        //                 <View style={styles.textContainer}>
        //                     <Text style={styles.name}>Khurram Namar</Text>
        //                     <Text style={styles.name}>Charbagh</Text>
        //                 </View>
        //             </View>
        //         </View>

        //         {/* Right Side (Action Buttons) */}
        //         <View style={styles.actions}>
        //             <TouchableOpacity style={styles.actionButton}>
        //                 <Image source={AppImages.callImage} style={styles.iconImage} />
        //             </TouchableOpacity>
        //             <TouchableOpacity style={styles.actionButton}>
        //                 <Image source={AppImages.cancelImage} style={styles.iconImage} />
        //             </TouchableOpacity>
        //         </View>
        //     </View>

        //     {/* Bottom Section */}
        //     <View style={styles.bottomSection}>
        //         <View style={styles.itemDetails}>
        //             <Text style={styles.itemText}>Electrical Item</Text>
        //         </View>
        //         <View style={styles.weightDetails}>
        //             <Text style={styles.itemText}>1 kg</Text>
        //         </View>
        //     </View>
        // </View>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        // padding: 10,
        height: '35%',
    },
    otpSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal:15,
        marginTop:3
        // marginBottom: 20,
       
    },
    otpLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: 'black',
    },
    otpInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    otpButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 8,
    },
    otpButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60%',
        paddingHorizontal:10
        
    },
    ProfileView: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
    },
    centeredView: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftAligned: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verticleLine: {
        height: 120,
        width: 4,
        backgroundColor: Colors.brandBlue,
        marginRight: 10,
    },
    textContainer: {
        justifyContent: 'space-between',
       
        flex:1,
        height:120
        
    },
    actions: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    actionButton: {
        backgroundColor: Colors.splashWhite,
        padding: 10,
        borderRadius: 40,
        marginBottom: 10,
    },
    iconImage: {
        width: 25,
        height: 25,
    },
    bottomSection: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignSelf:'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
        // paddingVertical: 10,
        marginLeft:70
    },
    itemDetails: {  
        borderRightWidth: 2,
        borderRightColor: Colors.brandBlue,
        paddingRight: 10,
    },
    weightDetails: {
        paddingLeft: 10,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
    },
});

export default ProfileSection;


