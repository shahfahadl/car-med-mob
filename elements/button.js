import styled from "styled-components/native";
import { borderRadius, colors, fonts } from "../utility/theme";
import { ActivityIndicator } from 'react-native';

const StyledButton = styled.TouchableOpacity`
  background-color: ${({ bgColor }) => bgColor || colors.yellow};
  ${borderRadius("5px")}
  padding: 10px 30px;
  display: flex;
  align-items: center;
  ${ ({loading , disabled})=> (loading || disabled) && "pointer-events: none;"}
`;

const CustomText = styled.Text`
  ${fonts.fontFamilyBold}
  color: ${({ inverted, color }) => color || (inverted ? "black" : "white")};
`;

export const CustomButton = ({ inverted,color, children, disabled=false, loading=false, ...rest }) => {
  return (
    <StyledButton {...rest} loading={loading} disabled={disabled} >
      {loading?
        <ActivityIndicator size="small" color={inverted? "black":"white"} />:
        <CustomText color={color} inverted={inverted}>{children}</CustomText>
      }
    </StyledButton>
  );
};

const StyledOutlineButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border: 3px solid ${({ color }) => color};
  ${borderRadius("5px")}
  ${ ({loading})=> loading && "pointer-events: none;"}
`;

export const CustomOutlineButton = ({ color,loading=false, children, ...rest }) => {
  return (
    <StyledOutlineButton loading={loading} color={color} {...rest}>
      {loading?
        <ActivityIndicator size="small" color={color} />:
        <CustomText color={color}>{children}</CustomText>
      }
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
//   width: 20px;
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
