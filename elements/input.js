import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import eyeBlack from '../assets/eye-black.png'
import eyeCloseBlack from '../assets/eye-close-black.png'
import eyeWhite from '../assets/eye-white.png'
import eyeCloseWhite from '../assets/eye-close-white.png'
import { TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../utility/theme';

const TextInputContainer = styled.View`
  max-width: 350px;
  width: ${({ width }) => width };
`;
  
const Hint = styled.Text`
  position: absolute;
  bottom: -12px;
  left: 0;
  font-size: 10px;
  color: ${colors.red};
`;

const Label = styled.Text`
  color: ${({ inverted }) => inverted? "white":"black" };
  margin-bottom: 10px;
`;

const Input = styled.TextInput`
  border: none;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ inverted }) => inverted? "white":"black" };
  color: ${({ inverted }) => inverted? "black":"white" };
  placeholderTextColor: #8a8a8a;
`;

export const CustomTextInput = ({ label,hint,width, inverted, ...rest }) => {
  return (
    <TextInputContainer width={width}  >
      <Label inverted={inverted} >{label}</Label>
      <View>
        <Input {...rest} inverted={inverted} />
        {hint && <Hint>{hint}</Hint>}
      </View>
    </TextInputContainer>
  );
};

const InputLeft = styled.View`
  position: absolute;
  top: calc(50% - 8px );
  right: 20px;
`;

const Images = styled.Image`
  width: 20px;
  height: 16px;
`;

export const CustomPasswordInput = ({ label,hint, width,inverted, ...rest }) => {

  const [hide , setHide] = useState(true)

  const invertHide = () => {
    setHide(!hide)
  }

  return (
    <TextInputContainer width={width} >
      <Label inverted={inverted} >{label}</Label>
      <View>
        <Input secureTextEntry={hide} {...rest} inverted={inverted} />
        <InputLeft>
          <TouchableOpacity onPress={invertHide}>
            {inverted?
              hide? <Images source={eyeBlack} /> : <Images source={eyeCloseBlack} /> :
              hide? <Images source={eyeWhite} /> : <Images source={eyeCloseWhite} />
            }
          </TouchableOpacity>
        </InputLeft>
        {hint && <Hint>{hint}</Hint>}
      </View>
    </TextInputContainer>
  );
};

const CustomPicker = styled(Picker)`
  border: none;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ inverted }) => inverted? "white":"black" };
  color: ${({ inverted }) => inverted? "black":"white" };
`;

export const CustomDropdownInput = ({ label,width, options , inverted=false, ...rest }) => {

  return (
    <TextInputContainer width={width} >
      <Label inverted={inverted} >{label}</Label>
      <CustomPicker
        inverted={inverted}
        {...rest}
      >
        {options.map((option)=>(
          <CustomPicker.Item key={option.label} label={option.label} value={option.value} />
        ))}
      </CustomPicker>
    </TextInputContainer>
  );
};

const ImageContainer = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid ${({ inverted }) => inverted? "white":"black" };
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${({ styling }) => styling}
`

const Image = styled.Image`
  width: 100%;
  height: 100%;
  resizeMode: 'cover';
`

export const CustomImageInput = ({image , setImage, inverted,styling}) => {

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const fileName = result.uri.split('/').pop();
      setImage({
        "uri": result.uri,
        "name": fileName,
        "type": result.type
      });
    }
  };

  return (
    <ImageContainer onPress={pickImage} inverted={inverted} styling={styling}>
      {image ? (
        <Image source={{ uri: image.uri }} />
      ) : (
        <Icon name='user' size={32} color={inverted? "white" : "black" } />
      )}
    </ImageContainer>
  )
}