import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAuth } from "../contexts/auth";
import { useNavigation } from "@react-navigation/native";
import Login from "../page-components/registration/login";
import Signup from "../page-components/registration/signup";
import Toast from "react-native-toast-message";
import { fonts } from "../utility/theme";
import Map from "../components/map";
// import LocationSelector from '../components/locationSelector';

const Common = styled.View`
  width: 100%;
  height: 100%;
  ${fonts.fontFamilyRegular}
`;

const Container = styled.ScrollView`
  width: 100%;
  height: 100%;
`;

const PositionFixed = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 4;
`;

function Registration() {
  const navigation = useNavigation();
  const { isAuthenticated, isVendor } = useAuth();
  const [ mapVisible, setMapVisible ] = useState(false);
  const [location, setLocation] = useState({
    name: null,
    latitude: null,
    longitude: null,
  });
  const [latLng, setLatLng] = useState({
    lat: null,
    lng: null,
  });

  function handleClose() {
    setLatLng({
      lat: null,
      lng: null,
    });
    setMapVisible(false);
  }

  useEffect(() => {
    if (isAuthenticated) {
      if (isVendor) {
        navigation.navigate("Vendor_availableOrders");
      } else {
        navigation.navigate("User_order");
      }
    }
  }, [isAuthenticated]);

  return (
    <Common>
        <Map
          mapVisible={mapVisible}
          setLocation={setLocation}
          lat={latLng.lat}
          lng={latLng.lng}
          handleClose={handleClose}
        />
      <PositionFixed>
        <Toast />
        {/* Place any thing you want to make position fixed */}
      </PositionFixed>
      <Container>
        <Login />
        <Signup
          setMapVisible={setMapVisible}
          location={location}
          setLocation={setLocation}
        />
      </Container>
    </Common>
  );
}

export default Registration;
