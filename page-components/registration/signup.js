import React from 'react'
import Toast from 'react-native-toast-message';

export default function Signup() {

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
    <SignupContainer>
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
          Already a member? <YellowText>Log In</YellowText>
        </BottomTag>
      </SignupContainer>
  )
}