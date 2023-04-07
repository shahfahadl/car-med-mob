import styled from 'styled-components/native';
import { colors , fonts } from '../utility/theme';

const StyledButton = styled.TouchableOpacity`
  background-color: ${colors.yellow};
  border-radius: 5px;
  padding: 10px 30px;
`;

const CustomText = styled.Text`
  ${fonts.fontFamilyBold}
  color: ${({ inverted }) => inverted? "black":"white" };
`;

export const CustomButton = ({inverted=false,children, ...rest }) => {
    return (
      <StyledButton {...rest} >
        <CustomText inverted={inverted} >
          {children}
        </CustomText>
      </StyledButton>
    );
  };