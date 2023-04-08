import React, { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { fonts, colors } from "../../utility/theme";
import styled from "styled-components/native";
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

const SignupContainer = styled.View`
  min-height: 110vh;
  width: calc(100% -40px);
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
  column-gap: 10px;
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
  row-gap: 10px;
  margin-bottom: 30px;
`;

const CreateAccountButtonContainer = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const YellowText = styled.Text`
  color: ${colors.yellow};
`;

const SignupButton = styled(CustomButton)`
    width: max-content;
`

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

  const [mapOpen, setMapOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState();
  const [role, setRole] = useState("user");

  const handleSignup = async () => {
    if (role === "user") {
      UserSignupSchema.validate(
        { ...values, image: image },
        { abortEarly: false }
      )
        .then(async () => {
          const data = new FormData();
          if (image) {
            data.append("profile", Date.now() + image.name);
            data.append("image", image);
          }
          data.append("name", values.name);
          data.append("cnic", values.cnic);
          data.append("email", values.email);
          data.append("password", values.password);
          data.append("gender", values.gender);

          try {
            let res = null;
            // if (image) {
            //   res = await UserService.add(payload);
            // } else {
            //   res = await UserService.addWithoutProfile(payload);
            // }
            // if (res.token) {
            //   login();
            //   UserService.storeUser(res);
            //   navigation.navigate("User_order");
            // }
            Toast.show({
              type: "success",
              text1: "Creating Account",
            });
          } catch (error) {
            console.error(error);
            Toast.show({
              type: "error",
              text1: "Some error occurred",
            });
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
    } else {
      VendorSignupSchema.validate(
        { ...values, image: image },
        { abortEarly: false }
      )
        .then(async () => {
          const payload = new FormData();
          payload.append("profile", Date.now() + image.name);
          payload.append("image", image);
          payload.append("name", values.name);
          payload.append("contact", values.contact);
          payload.append("email", values.email);
          payload.append("password", values.password);
          payload.append("cnic", values.cnic);
          payload.append("skill", values.skill);
          payload.append("gender", values.gender);
          try {
            const res = await VendorService.add(payload);
            if (res.token) {
              login();
              VendorService.storeVendor(res);
              navigation.navigate("Vendor_availableOrders");
            }
          } catch (error) {
            console.log(error);
            Toast.show({
              type: "error",
              text1: "Some error occurred",
            });
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
          image={values.image}
          inverted={true}
        />
      </View>
      {role === "vendor" && (
        <View style={{ rowGap: "10px" }}>
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
        <SignupButton inverted={true} onPress={handleSignup}>
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
