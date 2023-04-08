import React, { useEffect} from 'react'
import styled from 'styled-components/native';
import { useAuth } from '../contexts/auth'
import { useNavigation } from '@react-navigation/native';
import Login from '../page-components/registration/login';
// import Signup from '../page-components/registration/signup';

const RegistrationContainer = styled.ScrollView`
  min-height: 100%;
`;

function Registration() {

  const navigation = useNavigation();
  const { isAuthenticated , isVendor } = useAuth() ;

  useEffect(()=>{
    if(isAuthenticated){
      if(isVendor){
        navigation.navigate('Vendor_availableOrders');
      }else{
        navigation.navigate('User_order');
      }
    }
  },[isAuthenticated])

  return (
    <RegistrationContainer>
      <Login />
      {/* <Signup /> */}
    </RegistrationContainer>
  )
}

export default Registration