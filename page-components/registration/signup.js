import React, { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { fonts, colors } from "../../utility/theme";
import styled from "styled-components/native";
import { Buffer } from 'buffer';
import {
  CustomDropdownInput,
  CustomImageInput,
  CustomPasswordInput,
  CustomTextInput,
} from "../../elements/input";
import {
  signInAsOptions,
  genderOptions,
  skillOption,
} from "../../utility/common";
import {
  UserSignupSchema,
  VendorSignupSchema,
} from "../../utility/validationSchema";
import { CustomButton } from "../../elements/button";
import UserService from "../../utility/services/user";
import VendorService from "../../utility/services/vendor";
import { useAuth } from "../../contexts/auth";
import UploadMediaService from "../../utility/services/upload-service";
import axios from "axios";
import * as FileSystem from 'expo-file-system';

const SignupContainer = styled.View`
  padding: 20px;
  padding-bottom: 50px;
  background-color: black;
  border-top-right-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.View`
  width: 100%;
  color: white;
  margin-top: 30px;
`;

const FullNameAndGender = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 10px;
`;

const HeadingTop = styled.Text`
  color: white;
  ${fonts.fontSizeLarge}
`;

const HeadingBottom = styled.Text`
  ${fonts.fontSizeXLarge}
  ${fonts.fontFamilyBold}
  margin-bottom: 30px;
  margin-top: 20px;
  color: white;
`;

const BottomTag = styled.Text`
  ${fonts.fontFamilyBold}
  position: absolute;
  bottom: 20px;
  left: 20px;
  ${fonts.fontSizeLarge}
  color: white;
`;

const Location = styled.Text`
  color: white;
`;

const SignupForm = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const CreateAccountButtonContainer = styled.View`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 30px;
`;
const YellowText = styled.Text`
  color: ${colors.yellow};
`;

const SignupButton = styled(CustomButton)``;

const fetchImageFromUri = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

const Form = () => {
  const [values, setValues] = useState({
    name: "",
    cnic: "",
    email: "",
    password: "",
    gender: "male",
    contact: "",
    origin: "",
    skill: "",
  });

  const { login } = useAuth();
  const [mapOpen, setMapOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setErrors({});
    if (role === "user") {
      UserSignupSchema.validate(
        { ...values, image: image },
        { abortEarly: false }
      )
        .then(async () => {
          const data = {
            ...values,
          };
          try {
            Toast.show({
              type: "info",
              text1: "Creating Account",
            });
            const imgBlob = await fetchImageFromUri(image.uri);
            const fileName = imgBlob._data.name.slice(-10);
            const imageObject = {
              type: imgBlob._data.type,
              name: fileName
            }
            const signedUrl = await UploadMediaService.getSignedUrl(imageObject);
            await axios.put(signedUrl, Buffer.from(image.base64, 'base64'), {
              headers: {
                'Content-Type': imgBlob._data.type
              }
            });
            const imageUrl = signedUrl.split('?')[0];
            data.profile = imageUrl;
            setLoading(true);
            
            let res = await UserService.add(data);
            if (res.token) {
              login();
              Toast.show({
                type: "success",
                text1: "Welcome",
              });
              UserService.storeUser(res);
              navigation.navigate("User_order");
            }
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Some error occurred",
            });
          } finally {
            setLoading(false);
          }
        })
        .catch((validationErrors) => {
          const errors = {};
          validationErrors?.inner?.forEach((error) => {
            errors[error.path] = error.message;
          });
          setErrors(errors);
          Toast.show({
            type: "error",
            text1: "Form Values Incorrect",
          });
        });
    } else {
      VendorSignupSchema.validate(
        { ...values, image: image },
        { abortEarly: false }
      )
        .then(async () => {
          const payload = {
            ...values
          };
          try {
            setLoading(true);
            Toast.show({
              type: "success",
              text1: "Creating Account",
            });
            const imgBlob = await fetchImageFromUri(image.uri);
            const fileName = imgBlob._data.name.slice(-10);
            const imageObject = {
              type: imgBlob._data.type,
              name: fileName
            }
            const signedUrl = await UploadMediaService.getSignedUrl(imageObject);
            await axios.put(signedUrl, Buffer.from(image.base64, 'base64'), {
              headers: {
                'Content-Type': imgBlob._data.type
              }
            });
            const imageUrl = signedUrl.split('?')[0];
            payload.profile = imageUrl;
            const res = await VendorService.add(payload);
            if (res.token) {
              login();
              Toast.show({
                type: "success",
                text1: "Welcome",
              });
              VendorService.storeVendor(res);
              navigation.navigate("Vendor_availableOrders");
            }
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Some error occurred",
            });
          } finally {
            setLoading(false);
          }
        })
        .catch((validationErrors) => {
          const errors = {};
          validationErrors?.inner?.forEach((error) => {
            errors[error.path] = error.message;
          });
          setErrors(errors);
          Toast.show({
            type: "error",
            text1: "Form Values Incorrect",
          });
        });
    }
  };

  return (
    <SignupForm>
      <FullNameAndGender>
        <CustomTextInput
          hint={errors.name}
          value={values.name}
          onChangeText={(e) => setValues((prev) => ({ ...prev, name: e }))}
          width="60%"
          inverted={true}
          placeholder="Jones He"
          label="Full Name"
        />
        <CustomDropdownInput
          width="35%"
          inverted={true}
          options={genderOptions}
          label="Gender"
          selectedValue={values.gender}
          onValueChange={(e) => setValues((prev) => ({ ...prev, gender: e }))}
        />
      </FullNameAndGender>
      <CustomTextInput
        hint={errors.email}
        value={values.email}
        onChangeText={(e) => setValues((prev) => ({ ...prev, email: e }))}
        width="100%"
        inverted={true}
        placeholder="jone.doe@gmail.com"
        label="Email"
      />
      <CustomPasswordInput
        hint={errors.password}
        value={values.password}
        onChangeText={(e) => setValues((prev) => ({ ...prev, password: e }))}
        width="100%"
        inverted={true}
        placeholder="-------------"
        label="Password"
      />
      <View style={{ display: "flex", flexDirection: "row" }}>
        <View>
          <CustomTextInput
            hint={errors.cnic}
            value={values.cnic}
            onChangeText={(e) => setValues((prev) => ({ ...prev, cnic: e }))}
            width="150px"
            inverted={true}
            placeholder="----*---------*-"
            label="CNIC"
          />
          <CustomDropdownInput
            width="150px"
            inverted={true}
            options={signInAsOptions}
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
            label="Create Account As"
          />
        </View>
        <CustomImageInput
          hint={errors.image}
          styling={"margin-top: 20px;margin-left: 30px;"}
          setImage={setImage}
          image={image}
          inverted={true}
        />
      </View>
      {role === "vendor" && (
        <View>
          <CustomTextInput
            hint={errors.contact}
            value={values.contact}
            onChangeText={(e) => setValues((prev) => ({ ...prev, contact: e }))}
            width="100%"
            inverted={true}
            placeholder="+92 XXXXXXXXXXX"
            label="Contact"
          />
          <CustomDropdownInput
            width="100%"
            selectedValue={values.skill}
            onValueChange={(e) => setValues((prev) => ({ ...prev, skill: e }))}
            inverted={true}
            options={skillOption}
            label="Skills"
          />
          <Location hint={errors.origin}> Select Origin </Location>
        </View>
      )}
      <CreateAccountButtonContainer>
        <SignupButton inverted={true} loading={loading} onPress={handleSignup}>
          Create Account
        </SignupButton>
      </CreateAccountButtonContainer>
    </SignupForm>
  );
};

export default function Signup() {
  return (
    <SignupContainer>
      <Heading>
        <HeadingTop>
          Don't get Caught riding <YellowText>Dirty</YellowText>
        </HeadingTop>
        <HeadingBottom>
          Create new account <YellowText>.</YellowText>
        </HeadingBottom>
      </Heading>
      <Form />
      <BottomTag>
        Already a member? <YellowText>Log In</YellowText>
      </BottomTag>
    </SignupContainer>
  );
}
