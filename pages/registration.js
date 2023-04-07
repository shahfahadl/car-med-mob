import React, { useEffect, useState , useRef } from 'react'
import { CustomTextInput , CustomPasswordInput , CustomDropdownInput, CustomImageInput } from '../elements/input';
import { CustomButton } from '../elements/button';
import styled from 'styled-components/native';
import registrationImage from '../assets/registration-bg.png'
import arrowImage from '../assets/arrow-down.png'
import { colors, fonts } from '../utility/theme';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import UserService from '../utility/services/user';
import VendorService from '../utility/services/vendor';
import { useAuth } from '../contexts/auth'
import { useNavigation } from '@react-navigation/native';
import Navigation from '../Layout/Navigation';

const RegistrationContainer = styled.ScrollView`
  min-height: 100%;
`;
const SignupButton = styled.Text`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  bottom: 30px;
  ${fonts.fontFamilyBold}
  ${fonts.fontSizeLarge}
`;

const SignupContainer = styled.View`
  min-height: 110vh;
  width: calc(100% -40px );
  padding: 20px;
  padding-bottom: 50px;
  background-color: black;
  border-top-right-radius :40px;
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

const LoginContainer = styled.View`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: 15px;
`;

const SignupForm = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 30px;
`;

const RegistrationImage = styled.Image`
  position: absolute;
  top: 0;
  right: 0;
  width: 210px;
  height: 260px;
`
const ArrowImage = styled.Image`
  width: 60px;
  height: 24px;
`
const YellowText = styled.Text`
  color: ${colors.yellow};
`;

function Registration() {

  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [loginContainerY, setLoginContainerY] = useState(0);
  const [signupContainerY, setSignupContainerY] = useState(0);
  const [ email , setEmail ] = useState('')
  const [ name , setName ] = useState('')
  const [ password , setPassword ] = useState('')
  const [ userType , setUserType ] = useState('user')
  const [ gender , setGender ] = useState('male')
  const [ cnic , setCnic ] = useState('')
  const [ contact , setContact ] = useState('')
  const [ skills , setSkills ] = useState('dent')
  const [ image , setImage] = useState(null)
  const {login , isAuthenticated , isVendor} = useAuth() ;

  const singInAsOptions = [
    {label: "User" , value: "user" },
    {label: "Vendor" , value: "vendor" }
  ]

  const genderOptions = [
    {label: "Male" , value: "male" },
    {label: "Female" , value: "female" }
  ]

  const skillsOption = [
    { label: "Dent", value: 'dent' },
    { label: "Paint", value: 'paint' },
    { label: "Oil Change", value: 'oilChange' },
    { label: "Car Wash", value: 'carWash' },
    { label: "Tyres", value: 'tyres' },
    { label: "Wheel Alignment", value: 'wheelAlign' },
    { label: "Car Accessories", value: 'carAcc' },
    { label: "Gas Station", value: 'Gas' },
    { label: "Mechanic", value: 'mechanic' },
    { label: "Electrician", value: 'electrician' },
    { label: "Car Parts", value: 'parts' }
  ];

  const Login = async () => {
    if(email && password){
      try{
        const payload = {
          email: email,
          password: password
        }
        let res = null
        if(userType === "user"){
          res = await UserService.login(payload)
        }else{
          res = await VendorService.login(payload)
        }
        UserService.storeUser(res)
        if(res.token){
          login()
          if(userType === "user"){
            navigation.navigate('User_order');
          }else{
            navigation.navigate('Vendor_availableOrders');
          }
        }
        Toast.show({
          type: 'success',
          text1: 'Logging In',
        });
      }catch(error){
        Toast.show({
          type: 'error',
          text1: 'User not available',
        });
      }
    }else{
      Toast.show({
        type: 'error',
        text1: 'Please fill all of the inputs',
      });
    }
  }

  useEffect(()=>{
    if(isAuthenticated){
      if(isVendor){
        navigation.navigate('Vendor_availableOrders');
      }else{
        navigation.navigate('User_order');
      }
    }
  },[isAuthenticated])

  const signup = async () => {
    if(email && password && name && gender && cnic){
      if(userType === "vendor"){
        if(contact && skills && image){
        // ----- For vendor ------
          const payload = new FormData()
          payload.append('profile', Date.now() + image.name )
          payload.append('image', image)
          payload.append('name', name)
          payload.append('contact', contact)
          payload.append('email', email)
          payload.append('password', password)
          payload.append('cnic', cnic)
          payload.append('skill', skills)
          payload.append('gender', gender)
          try{
            const res = await VendorService.add(payload);
            if(res.token){
                login();
                VendorService.storeVendor(res);
                navigation.navigate('Vendor_availableOrders');
            }
          }catch(error){
            console.log(error)
            Toast.show({
              type: 'error',
              text1: 'Some error occurred',
            });
          }
        }else{
          Toast.show({
            type: 'error',
            text1: 'Please fill all of the inputs ( Including Image )',
          });
        }
      }else{
        // ----- For user ------
        const payload = {
          email: email,
          password: password,
          gender: gender,
          cnic: cnic,
          name: name,
        }
        const data = new FormData()
        if(image){
            data.append('profile', Date.now() + image.name)
            data.append('image', image)
        }
        data.append('name', name)
        data.append('cnic', cnic)
        data.append('email', email)
        data.append('password', password)
        data.append('gender',gender )

        try{
          let res = null
          if(image){
            res = await UserService.add(payload)
          }else{
            res = await UserService.addWithoutProfile(payload)
          }
          if(res.token){
            login();
            UserService.storeUser(res);
            navigation.navigate('User_order');
          }
          Toast.show({
            type: 'success',
            text1: 'Creating Account',
          });
        }catch(error){
          console.error(error)
          Toast.show({
            type: 'error',
            text1: 'Some error occurred',
          });
        }
      }
    }else{
      Toast.show({
        type: 'error',
        text1: 'Please fill all of the inputs',
      });
    }
  }

  const scrollToLogin = () => {
    console.log("loginContainerY : ",loginContainerY)
    console.log("scrollViewRef : ",scrollViewRef)
    scrollViewRef.current?.scrollTo({ x:0, y: signupContainerY, animated: true });
  }
  
  const scrollToSignup = () => {
    console.log("signupContainerY : ",signupContainerY)
    console.log("scrollViewRef : ",scrollViewRef)
    scrollViewRef.current?.scrollTo({ x:0, y: signupContainerY, animated: true });
  }

  return (
    <RegistrationContainer ref={scrollViewRef} scrollEnabled={true}>
      <Navigation />
      <LoginContainer onLayout={(e)=> {const layout = e.nativeEvent.layout;setLoginContainerY(layout.y)} }>
        <RegistrationImage source={registrationImage} />
        <CustomTextInput value={email} onChangeText={(e)=>setEmail(e)} width="80%" placeholder="example@gmail.com" label="Email" />
        <CustomPasswordInput value={password} onChangeText={(e)=>setPassword(e)} width="80%" placeholder="***************" label="Password" />
        <CustomDropdownInput width="80%" options={singInAsOptions} selectedValue={userType} onValueChange={(value)=>setUserType(value)} label="Sign-in As" />
        <CustomButton onPress={Login}>
          Log In
        </CustomButton>
        <SignupButton onPress={scrollToSignup} >
          Signup
          <ArrowImage source={arrowImage} />
        </SignupButton>
      </LoginContainer>
      <SignupContainer onLayout={(e)=> {const layout = e.nativeEvent.layout;setSignupContainerY(layout.y)} } >
        <Heading>
          <HeadingTop>
            Don't get Caught riding <YellowText>Dirty</YellowText>
          </HeadingTop>
          <HeadingBottom>
            Create new account <YellowText>.</YellowText>
          </HeadingBottom>
        </Heading>
        <SignupForm>
          <FullNameAndGender>
            <CustomTextInput value={name} onChangeText={(e)=>setName(e)} width="60%" inverted={true} placeholder="Jones He" label="Full Name" />
            <CustomDropdownInput width="35%" inverted={true} options={genderOptions} label="Gender" selectedValue={gender} onValueChange={(value)=>setGender(value)} />
          </FullNameAndGender>
          <CustomTextInput value={email} onChangeText={(e)=>setEmail(e)} width="100%" inverted={true} placeholder="jone.doe@gmail.com" label="Email"/>
          <CustomPasswordInput value={password} onChangeText={(e)=>setPassword(e)} width="100%" inverted={true} placeholder="-------------" label="Password"/>
          <View style={{display: "flex", flexDirection: "row"}} >
            <View>
              <CustomTextInput value={cnic} onChangeText={(e)=>setCnic(e)} width="150px" inverted={true} placeholder="----*---------*-" label="CNIC"/>
              <CustomDropdownInput width="150px" inverted={true} options={singInAsOptions} selectedValue={userType} onValueChange={(value)=>setUserType(value)} label="Create Account As" />
            </View>
            <CustomImageInput styling={"margin-top: 20px;margin-left: 30px;"} setImage={setImage} image={image} inverted={true}/>
          </View>
          {(userType === 'vendor') &&  
            <View style={{rowGap: "10px"}} >
              <CustomTextInput value={contact} onChangeText={(e)=>setContact(e)} width="100%" inverted={true} placeholder="+92 XXXXXXXXXXX" label="Contact"/>
              <CustomDropdownInput width="100%" selectedValue={skills} onValueChange={(value)=>setSkills(value)} inverted={true} options={skillsOption}  label="Skills" />
            </View>
          }
        </SignupForm>
        <CustomButton inverted={true} onPress={signup}>
          Create Account
        </CustomButton>
        <BottomTag>
          Already a member? <YellowText onPress={scrollToLogin} >Log In</YellowText>
        </BottomTag>
      </SignupContainer>
    </RegistrationContainer>
  )
}

export default Registration