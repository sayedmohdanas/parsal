import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { DeviceEventEmitter } from "react-native";
import { useDispatch } from "react-redux";
import { setStatusPending } from "../../redux/HitApis/HitApisSlice";
import { errorToast } from "../common/CommonFunction";
const AuthChecker = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    useEffect(() => {
        const checkAuth = async () => {
     const user = await AsyncStorage.getItem("user");

            console.log('user============>>>>>>',user);
            
            // console.log("Checking authentication", customerId);
        if (!user) {
                console.log("Navigating to EnterNumberScreen due to missing customerId");
                // dispatch(setStatusPending())
                errorToast('Error', 'Invalid Request');
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
            }
        };
        checkAuth();
        const unsubscribe = navigation.addListener("focus", checkAuth);
        const eventListener = DeviceEventEmitter.addListener("forceLogout", checkAuth);
        return () => {
            unsubscribe();
            eventListener.remove();
        };
    }, [navigation]);
    return null;
};
export default AuthChecker;