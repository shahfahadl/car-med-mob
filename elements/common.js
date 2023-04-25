import { CommonUtility } from "../utility/common";
import styled from "styled-components/native";
import userIcon from "../assets/user.svg";
import StarIcon from '../assets/star.svg'
import StarYellowIcon from '../assets/starYellow.svg'

const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const Image = styled.Image`
  height: 100%;
  width: 100%;
  resizemode: cover;
`;

const IconContainer = styled.Image`
  height: 30px;
`;

export const ImageContainer = ({ image, width = 65, height = 65 }) => {
  const url = image ? CommonUtility.useBackendImage(image) : null;
  return (
    <Container width={width} height={height}>
      {url ? <Image source={url} /> : <IconContainer source={userIcon} />}
    </Container>
  );
};

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
`;

export const StarElement = ({ starValue = 0}) => {
  return (
    <FlexRow>
      <IconContainer source={starValue >= 1 ? StarYellowIcon : StarIcon} />
      <IconContainer source={starValue >= 2 ? StarYellowIcon : StarIcon} />
      <IconContainer source={starValue >= 3 ? StarYellowIcon : StarIcon} />
      <IconContainer source={starValue >= 4 ? StarYellowIcon : StarIcon} />
      <IconContainer source={starValue >= 5 ? StarYellowIcon : StarIcon} />
    </FlexRow>
  );
};

const PopupOuterContainer = styled.TouchableOpacity`

`

const PopupInnerContainer = styled.TouchableOpacity`

`

export const Popup = ({show , setShow , children , ...rest}) => {
    return (
        <PopupOuterContainer>
            <PopupInnerContainer {...rest} >

            </PopupInnerContainer>
        </PopupOuterContainer>
    )
}