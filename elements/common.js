import { CommonUtility } from "../utility/common";
import styled from "styled-components/native";
import userIcon from "../assets/user.svg";
import StarIcon from "../assets/star.svg";
import StarYellowIcon from "../assets/starYellow.svg";
import Close from "../assets/close.svg";
import { Text } from "react-native";

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

const StarContainer = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
`

const StarIconContainer = styled.Image`
  height: 20px;
  weight: 20px;
`

export const StarElement = ({ starValue = 0 }) => {
  return (
    <FlexRow style={{columnGap: "2px"}} >
      <StarContainer>
        <StarIconContainer source={ (starValue >= 1)? StarYellowIcon : StarIcon } />
      </StarContainer>
      <StarContainer>
        <StarIconContainer source={ (starValue >= 2)? StarYellowIcon : StarIcon } />
      </StarContainer>
      <StarContainer>
        <StarIconContainer source={ (starValue >= 3)? StarYellowIcon : StarIcon } />
      </StarContainer>
      <StarContainer>
        <StarIconContainer source={ (starValue >= 4)? StarYellowIcon : StarIcon } />
      </StarContainer>
      <StarContainer>
        <StarIconContainer source={ (starValue >= 5)? StarYellowIcon : StarIcon } />
      </StarContainer>
    </FlexRow>
  );
};

const PopupOuterContainer = styled.TouchableOpacity`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  display: ${({ show }) => (show ? "flex" : "none")};
  z-index: ${({ zIndex }) => (zIndex ? zIndex : "1")};
`;

const PopupInnerContainer = styled.TouchableOpacity`
  width: 80%;
  max-height: 80vh;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  min-height: 50px;
`;

const CloseButton = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  background-image: url(${Close});
  background-size: cover;
  background-position: center;
  opacity: 0.5;
`;

export const Popup = ({ show, setShow, children, ...rest }) => {
  function close() {
    setShow(false);
  }

  return (
    <PopupOuterContainer show={show} onPress={close}>
      <PopupInnerContainer activeOpacity={1} {...rest} show={show}>
        <CloseButton
          onPress={close}
        />
        {children}
      </PopupInnerContainer>
    </PopupOuterContainer>
  );
};

// export const LocationPopup = ({ show, setShow}) => {
//   function close() {
//     setShow(false);
//   }

//   return (
//     <PopupOuterContainer zIndex="2" show={show} onPress={close}>
//       <PopupInnerContainer activeOpacity={1} {...rest} show={show}>
//         <CloseButton
//           onPress={close}
//         />
        
//       </PopupInnerContainer>
//     </PopupOuterContainer>
//   );
// };
