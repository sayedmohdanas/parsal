
import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { hitCheckUserStatusApi } from "../config/api/api";
import Colors from "./Colors";
import { responsiveFontSize } from "./metrices";

const AuthWrapper = ({ children }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem("user");
      const parsedUser = JSON.parse(user);

      if (!parsedUser) return;

      const params = {
        type: parsedUser?.payload?.owner_type == 0 ? 0 : 1,
        user_id:
          parsedUser?.payload?.owner_type == 0
            ? parsedUser?.payload?.driver_id
            : parsedUser?.payload?.partner_id,
      };

      const response = await hitCheckUserStatusApi(params);

      if (response?.user_status !== 1) {
        setShowModal(true);
      }
    };

    // Run the check every time a screen comes into focus
    const unsubscribe = navigation.addListener("focus", checkAuth);

    return () => unsubscribe();
  }, [navigation]);

  const handleLogout = async () => {
    
    await AsyncStorage.removeItem("user");
    setShowModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <>
      {children}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Account Suspended</Text>
            <Text style={styles.modalMessage}>Your account has been disabled. Please contact support for assistance</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "600",
    marginBottom: 10,
    color: Colors.red,
  },
  modalMessage: {
    fontSize: responsiveFontSize(14),
    marginBottom: 20,
    textAlign: "center",
    color:Colors.brandBlue,
    fontWeight:'500'
  },
  okButton: {
    backgroundColor: Colors.brandBlue,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AuthWrapper;
