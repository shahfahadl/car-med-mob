import React, { useEffect, useState } from 'react'
import { CustomTextInput , CustomPasswordInput , CustomDropdownInput, CustomImageInput } from '../elements/input';
import { CustomButton } from '../elements/button';
import styled from 'styled-components/native';
import { colors, fonts } from '../utility/theme';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import UserService from '../utility/services/user';
import VendorService from '../utility/services/vendor';
import { useAuth } from '../contexts/auth'
import { useNavigation } from '@react-navigation/native';
import Login from '../page-components/registration/login';
import { VendorSignupSchema , UserSignupSchema } from '../utility/validationSchema';
import Signup from '../page-components/registration/signup';

const RegistrationContainer = styled.ScrollView`
  min-height: 100%;
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

const SignupForm = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 30px;
`;

const ArrowImage = styled.Image`
  width: 60px;
  height: 24px;
`
const YellowText = styled.Text`
  color: ${colors.yellow};
`;

function Registration() {

  const navigation = useNavigation();
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

  const LoginFun = async () => {
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

  const signupFun = async () => {
    if(userType === "vendor"){
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
  }

  return (
    <RegistrationContainer>
      <Login />
      <Signup />
    </RegistrationContainer>
  )
}

export default Registration