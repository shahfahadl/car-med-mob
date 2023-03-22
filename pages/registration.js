import React, { useState } from 'react'
import { View ,Button ,TextInput  } from 'react-native';
import { CustomTextInput } from '../elements/input';



function Registration() {

  const [ email , setEmail ] = useState('')
  const [ password , setPassword ] = useState('')

  return (
    <View>
        <CustomTextInput placeholder="example@gmail.com" label="Email" />
    </View>
  )
}

export default Registration