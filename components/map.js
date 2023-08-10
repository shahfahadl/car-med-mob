import React, { useState } from "react";
import styled from "styled-components/native";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import process from "../env";
import Close from "../assets/close.png";
import Toast from "react-native-toast-message";

const MapContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  flex: 1;
  zIndex: 3;
`;

const SearchBar = styled.TouchableOpacity`
  position: absolute;
  padding: 10% 5%;
  padding-top: 5%;
  width: 100%;
  zIndex: 4;
`;

const CloseButton = styled.TouchableOpacity`
  margin-bottom: 20px;
  width: 30px;
  height: 30px;
`;

const CloseButtonIcon = styled.Image`
  width: 30px;
  height: 30px;
  opacity: 0.8;
`;

export default function Map({ mapVisible, setLocation , lat=null , lng=null, handleClose }) {
  const [latitude, setLatitude] = useState(34.0105);
  const [longitude, setLongitude] = useState(71.9876);

  function handleMapPress(event) {
    if( lat || lng ) return null
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
    Geocoder.from(latitude, longitude)
      .then((json) => {
        const cityComponent = json.results.find((component)=>
          component.types.includes("administrative_area_level_2")
        );
        const cityName = cityComponent ? cityComponent.address_components[0].long_name : "";
        setLocation({
          name: cityName,
          latitude: latitude,
          longitude: longitude,
        });
        Toast.show({
          type: "success",
          text1: `${cityName} Selected`,
        });
      })
      .catch((error) => console.warn(error));
  }

  function handleLocationSelect(data, details) {
    const { lat, lng } = details.geometry.location;
    setLatitude(lat);
    setLongitude(lng);
    const cityComponent = details.address_components.find((component) =>
      component.types.includes("administrative_area_level_2")
    );
    const cityName = cityComponent ? cityComponent.long_name : "";
    setLocation({
      name: cityName,
      latitude: lat,
      longitude: lng,
    });
    Toast.show({
      type: "success",
      text1: `${cityName} Selected`,
    });
  }

  return (
    <>
      {mapVisible && (
        <MapContainer>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: lat? lat : latitude,
              longitude: lng? lng : longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            initialRegion={{
              latitude: lat? lat : latitude,
              longitude: lng? lng : longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={{
                latitude: lat? lat : latitude,
                longitude: lng? lng : longitude,
              }}
            />
          </MapView>
            <SearchBar activeOpacity={1} >
              <CloseButton onPress={handleClose}>
                <CloseButtonIcon source={Close} />
              </CloseButton>
              { !lat && !lng && 
              <GooglePlacesAutocomplete
                placeholder="Search"
                fetchDetails={true}
                onPress={handleLocationSelect}
                styles={{
                  container: {
                    flex: 1,
                  },
                  textInput: {
                    height: 38,
                    color: "#5d5d5d",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 5,
                    backgroundColor: "#fff",
                  },
                }}
                query={{
                  key: process.GOOGLE_MAPS_KEY,
                  language: "en",
                }}
              />
            }
            </SearchBar>
        </MapContainer>
      )}

    </>
  );
}
