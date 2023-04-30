import styled from "styled-components/native";
import { colors, fonts } from "../utility/theme";

const StyledButton = styled.TouchableOpacity`
  background-color: ${({ bgColor }) => bgColor || colors.yellow};
  border-radius: 5px;
  padding: 10px 30px;
`;

const CustomText = styled.Text`
  ${fonts.fontFamilyBold}
  color: ${({ inverted, color }) => color || (inverted ? "black" : "white")};
`;

export const CustomButton = ({ inverted,color, children, ...rest }) => {
  return (
    <StyledButton {...rest}>
      <CustomText color={color} inverted={inverted}>{children}</CustomText>
    </StyledButton>
  );
};

const StyledOutlineButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border: 3px solid ${({ color }) => color};
  border-radius: 10px;
  width: ${({ width }) => width};
`;

export const CustomOutlineButton = ({ color, children, ...rest }) => {
  return (
    <StyledOutlineButton color={color} {...rest}>
      <CustomText color={color}>{children}</CustomText>
    </StyledOutlineButton>
  );
};

// const LocationContainer = styled.View`
//   max-width: 350px;
//   width: ${({ width }) => width };
// `;

// const Label = styled.Text`
//   color: ${({ inverted }) => inverted? "white":"black" };
//   margin-bottom: 10px;
// `;

// const CustomLocationButton = styled.Button`
//   border: none;
//   padding: 10px;
//   border-radius: 5px;
//   background-color: ${({ inverted }) => inverted? "white":"black" };
//   color: ${({ inverted }) => inverted? "black":"white" };
// `;

// const IconContainer = styled.Image`
//   height: 20px;
//   weight: 20px;
// `

// export const CustomLocationPicker = ({
//   label,
//   hint,
//   width,
//   inverted,
//   ...rest
// }) => {
//   return (
//     <LocationContainer width={width}>
//       <Label inverted={inverted}>{label}</Label>
//       <View>
//         <CustomLocationButton>
//           <IconContainer />

//         </CustomLocationButton>
//         {hint && <Hint>{hint}</Hint>}
//       </View>
//     </LocationContainer>
//   );
// };
