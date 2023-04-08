import React from 'react'

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