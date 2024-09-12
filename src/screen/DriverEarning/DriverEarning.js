// import React, { useState } from 'react';
// import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import Slick from 'react-native-slick';
// import AppImages from '../../common/AppImages';
// import Colors from '../../common/Colors';

// const { height } = Dimensions.get('window');

// const Earning = () => {
//     const [currentDateIndex, setCurrentDateIndex] = useState(0);

//     const dates = [
//         { date: '12 Sept 2024', earning: '₹5000' },
//         { date: '13 Sept 2024', earning: '₹3500' },
//         { date: '14 Sept 2024', earning: '₹6000' },
//     ];

//     const profileData = [
//         { id: 1, name: 'Ms Dhoni', location: 'Charbagh', place: 'Khurram Namar' },
//         { id: 2, name: 'Virat Kohli', location: 'Delhi', place: 'Civil Lines' },
//         { id: 3, name: 'Sachin Tendulkar', location: 'Mumbai', place: 'Bandra' },
//         { id: 4, name: 'Ms Dhoni', location: 'Charbagh', place: 'Khurram Namar' },
//         { id: 5, name: 'Virat Kohli', location: 'Delhi', place: 'Civil Lines' },
//         { id: 6, name: 'Sachin Tendulkar', location: 'Mumbai', place: 'Bandra' },
//         { id: 7, name: 'Ms Dhoni', location: 'Charbagh', place: 'Khurram Namar' },
//         { id: 8, name: 'Virat Kohli', location: 'Delhi', place: 'Civil Lines' },
//         { id: 9, name: 'Sachin Tendulkar', location: 'Mumbai', place: 'Bandra' },
//         { id: 10, name: 'Ms Dhoni', location: 'Charbagh', place: 'Khurram Namar' },
       
//         // Add more items here as required...
//     ];

//     const renderProfileItem = ({ item }) => (
//         <View style={styles.ProfileView}>
//             <View>
//             <Image source={AppImages.dhoniImage} style={styles.profileImage} />
//             <Text style={styles.name}>{item.name}</Text>
//             </View>
//             <View style={styles.profileDetails}>
//                 <View style={styles.rightSideContainer}>
//                     <Text style={styles.location}>{item.place}</Text>
//                     <Text style={styles.location}>{item.location}</Text>
//                 </View>
//             </View>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
            
//             {/* Slider Section */}
//             <View style={styles.sliderContainer}>
//                 <Slick
//                     showsPagination={false}
//                     autoplay={true}
//                     loop={false}
//                     style={styles.slickSlider}
//                     onIndexChanged={index => setCurrentDateIndex(index)}
//                 >
//                     {dates.map((item, index) => (
//                         <View key={index} style={styles.slide}>
//                             <Text style={styles.dateText}>{item.date}</Text>
//                             <Text style={styles.dateText}>{item.earning}</Text>

//                         </View>
//                     ))}
//                 </Slick>
//                 <View style={styles.sliderButtons}>
//                     <TouchableOpacity
//                         onPress={() => setCurrentDateIndex(prevIndex => (prevIndex - 1 + dates.length) % dates.length)}
//                         style={styles.button}
//                     >       
//                         <Text style={styles.buttonText}>{'<'}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         onPress={() => setCurrentDateIndex(prevIndex => (prevIndex + 1) % dates.length)}
//                         style={styles.button}
//                     >
//                         <Text style={styles.buttonText}>{'>'}</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* FlatList for Profile Data */}
//             <FlatList
//                 data={profileData}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={renderProfileItem}
//                 contentContainerStyle={styles.flatListContent}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'pink',
//     },
//     earningContainer: {
//         alignItems: 'center',
//         paddingVertical: 20,
//         backgroundColor: Colors.splashWhite,
//     },
//     earningText: {
//         fontSize: 20,
//         color: Colors.black,
//         fontWeight: '600',
//     },
//     earningAmount: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: Colors.brandBlue,
//         marginTop: 5,
//     },
//     sliderContainer: {
//         height: height * 0.1, // Adjust height for the slider
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     slickSlider: {
//         width: '80%',
//         height: '100%',
//     },
//     slide: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: Colors.lightGray,
//         paddingVertical: 20,
//     },
//     dateText: {
//         fontSize: 18,
//         color: Colors.black,
//         fontWeight: 'bold',
//     },
//     sliderButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '80%',
//         position: 'absolute',
//         bottom: 10,
//     },
//     button: {
//         backgroundColor: Colors.primary,
//         borderRadius: 20,
//         padding: 10,
//     },
//     buttonText: {
//         fontSize: 24,
//         color: 'white',
//     },
//     ProfileView: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         marginBottom: 10,
//         padding: 10,
//         borderWidth:0.25
//     },
//     profileImage: {
//         width: 70,
//         height: 70,
//         borderRadius: 35,
//         marginRight: 10,
//     },
//     profileDetails: {
//         flex: 1,
//         justifyContent: 'flex-start',
//     },
//     name: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: Colors.black,
//         marginTop:3
//     },
//     rightSideContainer: {
//         alignItems: 'flex-start',
//     },
//     location: {
//         fontSize: 16,
//         color: 'red',
//     },
//     flatListContent: {
//         paddingBottom: 20,
//     },
// });

// export default Earning;
import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Slick from 'react-native-slick';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';

const { height } = Dimensions.get('window');

const Earning = () => {
    // Sample profile data with earnings
    const profileData = [
        { id: 1, name: 'Ms Dhoni', location: 'Charbagh', place: 'Khurram Namar', earning: 50,distance:7.5 },
        { id: 2, name: 'Virat Kohli', location: 'Delhi', place: 'Civil Lines', earning: 6229,distance:8.5 },
        { id: 3, name: 'Sachin ', location: 'Mumbai', place: 'Bandra', earning: 1524 ,distance:10.8 },
        { id: 4, name: 'Msd', location: 'Charbagh', place: 'Khurram Namar', earning: 40 ,distance:9.5 },
        { id: 5, name: 'Virat singh', location: 'Delhi', place: 'Civil Lines', earning: 70 ,distance:7.7 },
        { id: 6, name: 'Sachin Thakur', location: 'Mumbai', place: 'Bandra', earning: 60 ,distance:8.3 },
        // Add more items if necessary...
    ];

    // Sample date data
    const dateData = [
        { date: '12 Sept 24', profiles: [1, 2] },
        { date: '18 Sept 24', profiles: [3, 4] },
        { date: '14 Sept 24', profiles: [5, 6] },
    ];

    const [currentDateIndex, setCurrentDateIndex] = useState(0);

    // Calculate total earnings for the selected date
    const getTotalEarnings = () => {
        const selectedProfiles = dateData[currentDateIndex].profiles;
        const earnings = profileData
            .filter(profile => selectedProfiles.includes(profile.id))
            .reduce((sum, profile) => sum + profile.earning, 0);
        return earnings;
    };

    const renderProfileItem = ({ item }) => (
        <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
                <View>
                <Image source={AppImages.dhoniImage} style={styles.profileImage} />
                <Text style={styles.name}>{item.name}</Text>
                </View>
                </View>
                <View style={styles.profileText}>
                <Text style={styles.place}>
  <Text style={{ fontWeight: 'bold',fontSize:16,marginRight:3 }}>from:</Text>
  {item.place}
</Text>
                    <Text style={styles.location}>to:{item.location}</Text>
                </View>
            
            <View style={styles.earningContainer}>
            <Text style={styles.earningText}>{item.distance}km</Text>

                <Text style={styles.earningText}>₹{item.earning}</Text>
            </View>
        </View>
    );

    // Handle date change
    const handlePrevDate = () => {
        setCurrentDateIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : dateData.length - 1));
    };

    const handleNextDate = () => {
        setCurrentDateIndex(prevIndex => (prevIndex < dateData.length - 1 ? prevIndex + 1 : 0));
    };

    // Get profiles for the selected date
    const selectedProfiles = profileData.filter(profile => dateData[currentDateIndex].profiles.includes(profile.id));

    return (
        <View style={styles.container}>
            {/* Slider Section */}
            <View style={styles.sliderContainer}>
                <TouchableOpacity onPress={handlePrevDate}>
                    <Text style={styles.sliderButton}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.dateText}>{dateData[currentDateIndex].date}</Text>
                <TouchableOpacity onPress={handleNextDate}>
                    <Text style={styles.sliderButton}>{">"}</Text>
                </TouchableOpacity>
            </View>

            {/* Display Total Earnings */}
            <View style={styles.earningDisplay}>
                {/* <Text style={styles.earningTitle}>Total Earning</Text> */}
                <Text style={styles.earningAmount}>₹{getTotalEarnings()}</Text>
            </View>

            {/* FlatList for Profile Data */}
            <FlatList
                data={selectedProfiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProfileItem}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    sliderButton: {
        fontSize: 40,
        color: Colors.black,
    },
    dateText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,
    },
    earningDisplay: {
        alignItems: 'center',
        // marginVertical: 20,
    },
    earningTitle: {
        fontSize: 18,
        color: Colors.black,
    },
    earningAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,    },
    profileCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        margin:5,
        borderRadius:10,
        shadowColor:Colors.lightGray,
        shadowOpacity:4,
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.lightGray,
        borderWidth:0.25,
        borderColor:Colors.lightGray,
        marginBottom:3
    },
    profileInfo: {
        flexDirection: 'row',
        flex:0.8
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    profileText: {
        justifyContent: 'center',
        flex:1.2
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black,
        marginTop:5
    },
    place: {
        fontSize: 14,
        color: Colors.black,    },
    location: {
        fontSize: 14,
        color: Colors.black,    },
    earningContainer: {
        justifyContent: 'space-around',
        alignItems:'center',
        flexDirection:"row",
        flex:1
    },
    earningText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,    },
    flatListContent: {
        paddingBottom: 20,
    },
});

export default Earning;
