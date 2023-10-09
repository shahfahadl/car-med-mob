import React, { useState , useRef , useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { fonts, colors } from "../../utility/theme";
import styled from "styled-components/native";
import { Buffer } from "buffer";
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
  EmailSchema,
  UserSignupSchema,
  VendorSignupSchema,
} from "../../utility/validationSchema";
import { CustomButton } from "../../elements/button";
import UserService from "../../utility/services/user";
import VendorService from "../../utility/services/vendor";
import { useAuth } from "../../contexts/auth";
import UploadMediaService from "../../utility/services/upload-service";
import axios from "axios";
import LocationSelector from "../../components/locationSelector";
import { useNavigation } from "@react-navigation/native";

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

const Form = ({ setMapVisible, location, setLocation }) => {
  const [values, setValues] = useState({
    name: "",
    cnic: "",
    otp: "",
    email: "",
    password: "",
    gender: "male",
    contact: "",
    city: "",
    lat: "",
    lng: "",
    skill: "dentAndPaint",
  });

  const [submitCount, setSubmitCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [onceClicked, setOnceClicked] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const intervalRef = useRef();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    setErrors({});
    if (role === "user") {
      const payload = {
        email: values.email,
        otp: values.otp,
        name: values.name,
        password: values.password,
        gender: values.gender,
        cnic: values.cnic,
        contact: values.contact,
        profile: image,
      };
      UserSignupSchema.validate(payload, { abortEarly: false })
        .then(async () => {
          try {
            Toast.show({
              type: "info",
              text1: "Creating Account",
            });
            setLoading(true);
            if (image) {
              const imgBlob = await fetchImageFromUri(image.uri);
              const fileName = imgBlob._data.name.slice(-10);
              const imageObject = {
                type: imgBlob._data.type,
                name: fileName,
              };
              const signedUrl = await UploadMediaService.getSignedUrl(
                imageObject
              );
              await axios.put(signedUrl, Buffer.from(image.base64, "base64"), {
                headers: {
                  "Content-Type": imgBlob._data.type,
                },
              });
              const imageUrl = signedUrl.split("?")[0];
              payload.profile = imageUrl;
            } else {
              payload.profile = "";
            }

            let res = await UserService.add(payload);

            if (res.token) {
              UserService.storeUser(res);
              login();
              Toast.show({
                type: "success",
                text1: "Welcome",
              });
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
          setErrors(errors)
          Toast.show({
            type: "error",
            text1: "Form Values Incorrect",
          });
        });
    } else {
      VendorSignupSchema.validate(
        {
          ...values,
          image: image,
          city: location.name,
          lat: location.latitude,
          lng: location.longitude,
        },
        { abortEarly: false }
      )
        .then(async () => {
          const payload = {
            ...values,
            city: location.name,
            lat: location.latitude,
            lng: location.longitude,
          };
          try {
            setLoading(true);
            Toast.show({
              type: "info",
              text1: "Creating Account",
            });
            const imgBlob = await fetchImageFromUri(image.uri);
            const fileName = imgBlob._data.name.slice(-10);
            const imageObject = {
              type: imgBlob._data.type,
              name: fileName,
            };
            const signedUrl = await UploadMediaService.getSignedUrl(
              imageObject
            );
            await axios.put(signedUrl, Buffer.from(image.base64, "base64"), {
              headers: {
                "Content-Type": imgBlob._data.type,
              },
            });
            const imageUrl = signedUrl.split("?")[0];
            payload.profile = imageUrl;
            const res = await VendorService.add(payload);
            if (res.token) {
              VendorService.storeVendor(res);
              login();
              Toast.show({
                type: "success",
                text1: "Welcome",
              });
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

  const generateOTP = () => {
    EmailSchema.validate(values.email)
    .then(async ()=> {
      setOtpLoading(true)
      setOnceClicked(true);
      try {
        await UserService.generateOTP({email: values.email})
        Toast.show({
          type: "info",
          text1: "Please check email for OTP",
        });
        setSubmitCount(prev => prev + 1);
        setSeconds(60);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "There was error generating OTP",
        });
        setOnceClicked(false);
      }finally {
        setOtpLoading(false)
      }
    })
    .catch((validationErrors) => {
      const errors = {};
      validationErrors?.inner?.forEach((error) => {
        errors[error.path] = error.message;
      });
      setErrors(errors)
      Toast.show({
        type: "error",
        text1: "Invalid Email",
      });
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    intervalRef.current = timer;
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [submitCount]);

  useEffect(() => {
    if (seconds < 1) {
      clearInterval(intervalRef.current);
      setOnceClicked(false)
    }
  }, [seconds]);

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
       <CustomButton
        style={{marginTop: 10}}
        inverted={true}
        onPress={generateOTP}
        disabled={onceClicked && seconds > 0} 
        loading={otpLoading}
      >
        {onceClicked ? `Resend OTP (${seconds}s)` : "Generate OTP"}
      </CustomButton>
      {
        onceClicked &&
        <CustomTextInput
          hint={errors.otp}
          value={values.otp}
          onChangeText={(e) => setValues((prev) => ({ ...prev, otp: e }))}
          width="100%"
          inverted={true}
          placeholder="Your OTP here"
          label="Input OTP"
        />
      }
      
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
        </View>
        <CustomImageInput
          hint={errors.image}
          styling={"margin-top: 20px;margin-left: 30px;"}
          setImage={setImage}
          image={image}
          inverted={true}
        />
      </View>
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
        width="150px"
        inverted={true}
        options={signInAsOptions}
        selectedValue={role}
        onValueChange={(value) => setRole(value)}
        label="Create Account As"
      />
      {role === "vendor" && (
        <View>
          <CustomDropdownInput
            width="100%"
            selectedValue={values.skill}
            onValueChange={(e) => setValues((prev) => ({ ...prev, skill: e }))}
            inverted={true}
            options={skillOption}
            label="Skills"
          />
          <LocationSelector
            setMapVisible={setMapVisible}
            location={location}
            setLocation={setLocation}
            inverted={true}
            hint={errors.city}
            width={"350px"}
          />
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

export default function Signup({ setMapVisible, location, setLocation }) {
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
      <Form
        setMapVisible={setMapVisible}
        location={location}
        setLocation={setLocation}
      />
      <BottomTag>
        Already a member? <YellowText>Log In</YellowText>
      </BottomTag>
    </SignupContainer>
  );
}
