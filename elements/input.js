import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { View, Text } from "react-native";
import eyeBlack from "../assets/eye-black.png";
import eyeCloseBlack from "../assets/eye-close-black.png";
import eyeWhite from "../assets/eye-white.png";
import eyeCloseWhite from "../assets/eye-close-white.png";
import dateIcon from "../assets/date.png";
import timeIcon from "../assets/time.png";
import { TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors, borderRadius, fonts } from "../utility/theme";
import StarIcon from "../assets/star.png";
import StarYellowIcon from "../assets/starYellow.png";
import DateTimePicker from "@react-native-community/datetimepicker";

const TextInputContainer = styled.View`
  max-width: 350px;
  width: ${({ width }) => width};
`;

const Hint = styled.Text`
  position: absolute;
  bottom: -12px;
  left: 0;
  font-size: 10px;
  color: ${colors.red};
`;

const Label = styled.Text`
  color: ${({ inverted, labelColor }) =>
    labelColor ? labelColor : inverted ? "white" : "black"};
  margin-bottom: 10px;
  ${fonts.fontFamilyBold}
`;

const Input = styled.TextInput`
  border: none;
  padding: 10px;
  ${borderRadius("5px")}
  background-color: ${({ inverted }) => (inverted ? "#f1f3f5" : "black")};
  color: ${({ inverted }) => (inverted ? "black" : "white")};
`;

export const CustomTextInput = ({
  label,
  labelColor = null,
  hint,
  width,
  inverted,
  ...rest
}) => {
  return (
    <TextInputContainer width={width}>
      <Label inverted={inverted} labelColor={labelColor}>
        {label}
      </Label>
      <View>
        <Input {...rest} inverted={inverted} />
        {hint && <Hint>{hint}</Hint>}
      </View>
    </TextInputContainer>
  );
};

const InputLeft = styled.View`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-8px);
`;

const Images = styled.Image`
  width: 20px;
  height: 16px;
`;

export const CustomPasswordInput = ({
  label,
  hint,
  width,
  inverted,
  ...rest
}) => {
  const [hide, setHide] = useState(true);

  const invertHide = () => {
    setHide(!hide);
  };

  return (
    <TextInputContainer width={width}>
      <Label inverted={inverted}>{label}</Label>
      <View>
        <Input secureTextEntry={hide} {...rest} inverted={inverted} />
        <InputLeft>
          <TouchableOpacity onPress={invertHide}>
            {inverted ? (
              hide ? (
                <Images source={eyeBlack} />
              ) : (
                <Images source={eyeCloseBlack} />
              )
            ) : hide ? (
              <Images source={eyeWhite} />
            ) : (
              <Images source={eyeCloseWhite} />
            )}
          </TouchableOpacity>
        </InputLeft>
        {hint && <Hint>{hint}</Hint>}
      </View>
    </TextInputContainer>
  );
};

const CustomPickerContainer = styled.View`
  border: 2px solid black;
  ${borderRadius("5px")}
`;

const CustomPicker = styled(Picker)`
  border: 2px solid black;
  padding: 10px;
  background-color: ${({ inverted }) => (inverted ? "white" : "black")};
  color: ${({ inverted }) => (inverted ? "black" : "white")};
`;

const IconContainer = styled.Image`
  height: 20px;
  width: 20px;
`;

export const CustomDropdownInput = ({
  label,
  width,
  hint,
  labelColor = null,
  style,
  options,
  inverted = false,
  ...rest
}) => {
  return (
    <TextInputContainer width={width}>
      <Label inverted={inverted} labelColor={labelColor}>
        {label}
      </Label>
      <CustomPickerContainer style={style}>
        <CustomPicker
          inverted={inverted}
          {...rest}
          dropdownIconColor={inverted ? "black" : "white"}
          // selectedValue={selectedValue}
          // onValueChange={(itemValue, itemIndex) =>
          //   setSelectedValue(itemValue)
          // }
        >
          {options.map((option) => (
            <CustomPicker.Item
              key={option.label}
              label={option.label}
              value={option.value}
            />
          ))}
        </CustomPicker>
      </CustomPickerContainer>
      {hint && <Hint>{hint}</Hint>}
    </TextInputContainer>
  );
};

const ImageContainer = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border: 4px solid ${({ inverted }) => (inverted ? "white" : "black")};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${({ styling }) => styling}
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
  resizemode: "cover";
`;

export const CustomImageInput = ({ image, setImage, inverted, styling }) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const regex = /data:(.*);base64,/;
      const match = result.uri.match(regex);
      const imageType = match[1];
      const imageEnding = match[1].split("/")[1];
      setImage({
        uri: result.uri,
        type: imageType,
        name: Date.now() + "." + imageEnding,
      });
    }
  };

  return (
    <ImageContainer onPress={pickImage} inverted={inverted} styling={styling}>
      {image ? (
        <Image source={{ uri: image.uri }} />
      ) : (
        <Icon name="user" size={32} color={inverted ? "white" : "black"} />
      )}
    </ImageContainer>
  );
};

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
`;

const StarContainer = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
`;

export const StarInput = ({ starValue = 0, setStarValue, ...rest }) => {
  return (
    <FlexRow style={{ gap: "5px" }} {...rest}>
      <StarContainer onPress={() => setStarValue(1)}>
        <IconContainer source={starValue >= 1 ? StarYellowIcon : StarIcon} />
      </StarContainer>
      <StarContainer onPress={() => setStarValue(2)}>
        <IconContainer source={starValue >= 2 ? StarYellowIcon : StarIcon} />
      </StarContainer>
      <StarContainer onPress={() => setStarValue(3)}>
        <IconContainer source={starValue >= 3 ? StarYellowIcon : StarIcon} />
      </StarContainer>
      <StarContainer onPress={() => setStarValue(4)}>
        <IconContainer source={starValue >= 4 ? StarYellowIcon : StarIcon} />
      </StarContainer>
      <StarContainer onPress={() => setStarValue(5)}>
        <IconContainer source={starValue >= 5 ? StarYellowIcon : StarIcon} />
      </StarContainer>
    </FlexRow>
  );
};

const StyledButton = styled.TouchableOpacity`
  background-color: ${colors.yellow};
  color: black;
  padding: 10px;
  ${borderRadius("5px")}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const CustomDatePicker = ({
  width = "130px",
  hint,
  labelColor = null,
  inverted = false,
  value,
  setValue,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const showDatePicker = () => {
    setShowPicker(true);
  };

  useEffect(() => {
    setValue(
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  }, [date]);

  const handleChange = (data) => {
    setShowPicker(false);
    setDate(new Date(data.nativeEvent.timestamp));
  };

  return (
    <TextInputContainer width={width}>
      <Label inverted={inverted} labelColor={labelColor}>
        Date
      </Label>
      <StyledButton onPress={showDatePicker}>
        <Text>
          {value ? `${value}` : "Select Date"}
        </Text>
        <IconContainer source={dateIcon} />
      </StyledButton>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
      {hint && <Hint>{hint}</Hint>}
    </TextInputContainer>
  );
};

export const CustomTimePicker = ({
  width = "130px",
  hint,
  labelColor = null,
  inverted = false,
  value,
  setValue,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());

  const showTimePicker = () => {
    setShowPicker(true);
  };

  useEffect(() => {
    setValue(
      time.getHours() + ":" + time.getMinutes()
    );
  }, [time]);

  const handleChange = (data) => {
    setShowPicker(false);
    setTime(new Date(data.nativeEvent.timestamp));
  };

  return (
    <TextInputContainer width={width}>
      <Label inverted={inverted} labelColor={labelColor}>
        Time
      </Label>
      <StyledButton onPress={showTimePicker}>
        <Text>
          {value ? `${value}` : "Select Time"}
        </Text>
        <IconContainer source={timeIcon} />
      </StyledButton>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleChange}
        />
      )}
      {hint && <Hint>{hint}</Hint>}
    </TextInputContainer>
  );
};
