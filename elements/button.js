import styled from 'styled-components/native';
import { colors , fonts } from '../utility/theme';

const StyledButton = styled.TouchableOpacity`
  background-color: ${colors.yellow};
  border-radius: 5px;
  padding: 10px 30px;
`;

const CustomText = styled.Text`
  ${fonts.fontFamilyBold}
  color: ${({ inverted, color }) => color || (inverted? "black":"white") };
`;

export const CustomButton = ({inverted,children, ...rest }) => {
    return (
      <StyledButton {...rest} >
        <CustomText inverted={inverted} >
          {children}
        </CustomText>
      </StyledButton>
    );
  };

const StyledOutlineButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border: 3px solid ${({color})=>color};
  border-radius: 10px;

`

export const CustomOutlineButton = ({color,children, ...rest }) => {
    return (
      <StyledOutlineButton color={color} {...rest} >
        <CustomText color={color} >
          {children}
        </CustomText>
      </StyledOutlineButton>
    );
  };