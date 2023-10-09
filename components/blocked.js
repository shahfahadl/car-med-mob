import { useEffect } from "react";
import { Popup } from "../elements/common";
import { Linking } from "react-native";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";

const H4 = styled.Text`
  opacity: ${({ light }) => (light ? "0.5" : "1")};
  text-transform: capitalize;
  ${({ bold }) => bold && fonts.fontFamilyBold}
`;

export const BlockedComponent = ({ blockedShow, setBlockedShow }) => {
  useEffect(() => {
    if (blockedShow) {
      Toast.show({
        type: "error",
        text1: `You are blocked`,
      });
    }
  }, [blockedShow]);

  const handleEmailPress = async () => {
    const url = `mailto:carmed.contact4@gmail.com?subject=Why am I blocked`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening email:", error);
    }
  };

  return (
    <Popup show={blockedShow} setShow={setBlockedShow}>
      <H4 style={{ fontSize: 24, height: 50 }}>You've been blocked</H4>
      <H4>Please contact</H4>
      <H4 onPress={handleEmailPress} style={{ color: "blue", height: 50 }}>
        carmed.contact4@gmail.com
      </H4>
    </Popup>
  );
};
