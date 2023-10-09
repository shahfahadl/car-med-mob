import React, { useState, useEffect } from "react";
import { Platform, Text } from "react-native";
import styled from "styled-components/native";
import Geocoder from "react-native-geocoding";
import * as Location from "expo-location";
import { borderRadius, colors, fonts } from "../utility/theme";

const LocationContainer = styled.TouchableOpacity`
  border: 2px solid black;
  ${borderRadius("5px")}
  display: flex;
  justify-content: center;
  padding: 10px;
  ${({ inverted }) => inverted && "background-color: white; color: black;"}
`;

const Container = styled.View`
  max-width: 350px;
  width: ${({ width }) => width};
`;

const Label = styled.Text`
  color: ${({ inverted, labelColor }) =>
    labelColor ? labelColor : inverted ? "white" : "black"};
  margin-bottom: 10px;
  ${fonts.fontFamilyBold}
`;

const Hint = styled.Text`
  position: absolute;
  bottom: -12px;
  left: 0;
  font-size: 10px;
  color: ${colors.red};
`;

export default function LocationSelector({
  setMapVisible,
  location,
  setLocation,
  hint,
  width = "130px",
  labelColor = null,
  inverted = false,
  autoSelect = true,
  ...rest
}) {
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    {
      autoSelect &&
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          Geocoder.from(location.coords.latitude, location.coords.longitude)
            .then((json) => {
              const cityComponent = json.results.find((component) =>
                component.types.includes("administrative_area_level_2")
              );
              const cityName = cityComponent
                ? cityComponent.address_components[0].long_name
                : "";
              setLocation({
                name: cityName,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            })
            .catch((error) => console.warn(error));
        })();
    } 
  }, []);

  function selectLocation() {
    setMapVisible(true);
  }

  return (
    <Container width={width} {...rest}>
      <Label inverted={inverted} labelColor={labelColor}>
        Location
      </Label>
      <LocationContainer inverted={inverted} onPress={selectLocation}>
        <Text>
          {errorMsg || location.name ? location.name : "Select Location"}
        </Text>
      </LocationContainer>
      {hint && <Hint>{hint}</Hint>}
    </Container>
  );
}
