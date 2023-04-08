import React, { useState } from 'react'
import registrationImage from '../../assets/registration-bg.png'
import arrowImage from '../../assets/arrow-down.png'
import { CustomTextInput, CustomDropdownInput , CustomPasswordInput } from '../../elements/input';
import { CustomButton } from '../../elements/button';
import { LoginSchema } from '../../utility/validationSchema';

const SignupButton = styled.Text`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  bottom: 30px;
  ${fonts.fontFamilyBold}
  ${fonts.fontSizeLarge}
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

export default function Login() {

  const [ values , setValues ] = useState({
    email: "",
    password: "",
    role:"user"
  })

  return (
    <LoginContainer>
        <RegistrationImage source={registrationImage} />
        <CustomTextInput value={email} onChangeText={(e)=>setEmail(e)} width="80%" placeholder="example@gmail.com" label="Email" />
        <CustomPasswordInput value={password} onChangeText={(e)=>setPassword(e)} width="80%" placeholder="***************" label="Password" />
        <CustomDropdownInput width="80%" options={singInAsOptions} selectedValue={userType} onValueChange={(value)=>setUserType(value)} label="Sign-in As" />
        <CustomButton onPress={Login}>
          Log In
        </CustomButton>
        <SignupButton>
          Signup
          <ArrowImage source={arrowImage} />
        </SignupButton>
      </LoginContainer>
  )
}