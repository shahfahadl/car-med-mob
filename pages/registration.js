import React, { useEffect } from "react";
import styled from "styled-components/native";
import { useAuth } from "../contexts/auth";
import { useNavigation } from "@react-navigation/native";
import Login from "../page-components/registration/login";
import Signup from "../page-components/registration/signup";
import Toast from "react-native-toast-message";
import { fonts } from "../utility/theme";
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
  z-index: 1;
`;

function Registration() {
  const navigation = useNavigation();
  const { isAuthenticated, isVendor } = useAuth();

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
      <PositionFixed>
        <Toast />
        {/* Place any thing you want to make position fixed */}
      </PositionFixed>
      <Container>
        <Login />
        <Signup />
      </Container>
    </Common>
  );
}

export default Registration;
