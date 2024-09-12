import React from "react";
import { ActivityIndicator, StyleSheet, Text, Modal, View } from "react-native";
import Colors from "../../common/Colors";
import { mystyles } from "../../common/Mystyle";

const Loading = (props) => {
    return (
        <>
            {props.loading && <Modal
                animationType="slide"
                transparent={true}
                visible={props.loader}
            >
                <View style={[styles.jf_center, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={styles.modalView}>
                        <View style={[styles.row_cen, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                            <View style={{ paddingHorizontal: 20 }}>
                                <ActivityIndicator size={'large'} color={Colors.brandBlue} />
                            </View>
                            <Text style={{
                                color: Colors.black,
                                fontSize: 16,
                                fontWeight: '500',
                                flex: 1,
                            }}>{`Loading...`}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
            }
        </>
    )
}
const styles = StyleSheet.create({
    modalView: {
        height: 70,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent: "center"
    },
    modalText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.black
    },
    row_center: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    justify_center: {
        justifyContent: "center"
    },
    jf_center: {
        flex: 1,
        justifyContent: "center"
    }
})
export default Loading