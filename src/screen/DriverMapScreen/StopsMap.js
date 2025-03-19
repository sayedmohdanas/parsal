import React from "react";
import { View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { completeStop } from "../../redux/HitApis/HitApiSlice";


const StopsMap = () => {
  const dispatch = useDispatch();
  const { stops, currentStopIndex, orderCompleted } = useSelector(
    (state) => state.parsalPartner
  );

  if (orderCompleted) {
    return <Text>✅ Ride Completed!</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: stops[currentStopIndex]?.stop_lat || 0,
          longitude: stops[currentStopIndex]?.stop_lng || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {stops.map((stop, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: stop.stop_lat,
              longitude: stop.stop_lng,
            }}
            title={stop.stop_address}
            pinColor={index === currentStopIndex ? "green" : index < currentStopIndex ? "red" : "blue"} // Green = Current, Red = Completed, Blue = Upcoming
          />
        ))}
      </MapView>

      <View style={{ padding: 10 }}>
        <Text>🚗 Current Stop: {stops[currentStopIndex]?.stop_address}</Text>
        <Button
          title="Mark Stop as Completed"
          onPress={() => dispatch(completeStop())}
        />
      </View>
    </View>
  );
};

export default StopsMap;
