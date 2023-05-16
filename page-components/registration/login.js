import React, { useState } from "react";
import styled from "styled-components/native";
import registrationImage from "../../assets/registration-bg.png";
import arrowImage from "../../assets/arrow-down.png";
import { CustomButton } from "../../elements/button";
import Toast from "react-native-toast-message";
import { LoginSchema } from "../../utility/validationSchema";
import UserService from "../../utility/services/user";
import VendorService from "../../utility/services/vendor";
import { useAuth } from "../../contexts/auth";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../../utility/theme";
import { signInAsOptions } from "../../utility/common";
import {
  CustomDropdownInput,
  CustomTextInput,
  CustomPasswordInput,
} from "../../elements/input";
import { Dimensions } from "react-native";

const SignupButton = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  bottom: 30px;
`;

const SignupButtonText = styled.Text`
  ${fonts.fontFamilyBold}
  ${fonts.fontSizeLarge}
`;

const LoginContainer = styled.View`
  width: 100%;
  height: ${({ height }) => `${100 * height}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
`;

const RegistrationImage = styled.Image`
  position: absolute;
  top: 0;
  right: 0;
  width: 210px;
  height: 260px;
`;
const ArrowImage = styled.Image`
  width: 60px;
  height: 24px;
`;

export default function Login() {
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState("user");
  const navigation = useNavigation();
  const { login } = useAuth();
  const { height } = Dimensions.get("window");
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const handleLogin = () => {
    setErrors({});
    LoginSchema.validate(values, { abortEarly: false })
      .then(async () => {
        try {
          setLoading(true);
          Toast.show({
            type: "info",
            text1: "Finding User",
          });
          let res = null;
          if (role === "user") {
            res = await UserService.login(values);
          } else {
            res = await VendorService.login(values);
          }
          UserService.storeUser(res);
          if (res.token) {
            login();
            Toast.show({
              type: "success",
              text1: "Welcome",
            });
            if (role === "user") {
              navigation.navigate("User_order");
            } else {
              navigation.navigate("Vendor_availableOrders");
            }
          }
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "User not available",
          });
        } finally {
          setLoading(false);
        }
      })
      .catch((validationErrors) => {
        const errors = {};
        validationErrors.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setErrors(errors);
        Toast.show({
          type: "error",
          text1: "Form Values Incorrect",
        });
      });
  };

  return (
    <LoginContainer height={Math.round(height / 100)}>
      <RegistrationImage source={registrationImage} />
      <CustomTextInput
        value={values.email}
        onChangeText={(e) => setValues((prev) => ({ ...prev, email: e }))}
        width="80%"
        placeholder="example@gmail.com"
        label="Email"
        hint={errors.email}
      />
      <CustomPasswordInput
        value={values.password}
        onChangeText={(e) => setValues((prev) => ({ ...prev, password: e }))}
        width="80%"
        placeholder="***************"
        label="Password"
        hint={errors.password}
      />
      <CustomDropdownInput
        width="80%"
        options={signInAsOptions}
        selectedValue={role}
        onValueChange={(value) => setRole(value)}
        label="Sign-in As"
      />
      <CustomButton loading={loading} onPress={handleLogin}>
        Log In
      </CustomButton>
      <SignupButton>
        <SignupButtonText>Signup</SignupButtonText>
        <ArrowImage source={arrowImage} />
      </SignupButton>
    </LoginContainer>
  );
}
