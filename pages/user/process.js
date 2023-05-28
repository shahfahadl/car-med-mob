import { View } from "react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUserProcess } from "../../hooks/watchOrder";
import { borderRadius, colors, fonts } from "../../utility/theme";
import { CommonUtility } from "../../utility/common";
import { CustomOutlineButton } from "../../elements/button";
import UserService from "../../utility/services/user";
import Toast from "react-native-toast-message";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Map from "../../components/map";

const Common = styled.View`
  width: 100%;
  height: 100%;
  ${fonts.fontFamilyRegular}
  padding-top: ${({ statusBarHeight }) => `${statusBarHeight}px`};
`;

const Container = styled.ScrollView`
  margin-top: 60px;
  width: 100%;
  height: ${({ height }) => `${height - 60}px`};
`;

const ToastContainer = styled.View`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 5;
`;

const OrdersContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

const OrderContainer = styled.View`
  display: flex;
  width: 95%;
  max-width: 600px;
  padding: 20px;
  border: 2px solid ${colors.halfBlack};
  ${borderRadius("5px")}
`;

const ShowMaps = styled.TouchableOpacity`
  padding: 0px 5px;
  border: 2px solid black;
  background-color: ${colors.yellowLight};
  ${borderRadius("15px")}
`;

const H4 = styled.Text`
  opacity: ${({ light }) => (light ? "0.5" : "1")};
  text-transform: capitalize;
  ${({ bold }) => bold && fonts.fontFamilyBold}
`;

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
`;

const Center = styled.View`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Bottom = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: space-between;
`;

const OrderItem = ({ order , setMapVisible , setLatLng}) => {
  const [apiLoading, setApiLoading] = useState(false);
  function cancelOrder() {
    try {
      setApiLoading(true);
      Toast.show({
        type: "info",
        text1: "Canceling Order",
      });
      UserService.cancelOrder({ id: order.id });
      Toast.show({
        type: "success",
        text1: "Order Canceled",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An Error Ocurred",
      });
    } finally {
      setApiLoading(false);
    }
  }

  function handleShowMaps(){
    setLatLng({
      lat: order.latLng.lat ,
      lng: order.latLng.lng
    })
    setMapVisible(true)
  } 

  return (
    <OrderContainer>
      <View>
        <FlexRow style={{ marginBottom: 10 }}>
          <H4 bold>Vendor Name &nbsp;</H4>
          <H4>{order.vendorName}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Car Type &nbsp;</H4>
          <H4>{order.carType}</H4>
        </FlexRow>
        <FlexRow style={{ alignItems: "center" }}>
          <H4 bold>Location &nbsp;</H4>
          <H4 light>{order.location} &nbsp;</H4>
          <ShowMaps onPress={handleShowMaps} >
            <H4>Show Map</H4>
          </ShowMaps>
        </FlexRow>
        <FlexRow>
          <H4 bold>Problem &nbsp;</H4>
          <H4>{order.problem}</H4>
        </FlexRow>
        {
            order.date &&
            <>
              <H4 bold>Appointment &nbsp;</H4>
            <FlexRow>
              <H4 bold>Date &nbsp;</H4>
              <H4>{order.date}</H4>
            </FlexRow>
            <FlexRow>
              <H4 bold>Time &nbsp;</H4>
              <H4>{order.time}</H4>
            </FlexRow>
            </>
          }
      </View>
      <Bottom style={{ marginTop: 20 }}>
        <FlexRow>
          <H4 light bold>
            Price &nbsp;
          </H4>
          <H4 bold>{CommonUtility.currencyFormat(order.bid)}</H4>
        </FlexRow>
        <CustomOutlineButton
          loading={apiLoading}
          color={colors.red}
          onPress={cancelOrder}
        >
          Cancel
        </CustomOutlineButton>
      </Bottom>
    </OrderContainer>
  );
};

const Process = () => {
  const { data: orders, loading } = orderUserProcess();
  const { height } = Dimensions.get("window");
  const [mapVisible, setMapVisible] = useState(false);
  const [latLng, setLatLng] = useState({
    lat: null,
    lng: null,
  });

  function handleClose (){
    setMapVisible(false)
  }

  const insets = useSafeAreaInsets();
  return (
    <Common statusBarHeight={insets.top}>
      <Container height={height}>
        {loading ? (
          <ActivityIndicator size="large" color={"black"} />
        ) : (
          <>
            {orders.length > 0 ? (
              <OrdersContainer>
                {orders?.map((order) => (
                  <OrderItem key={order.id} order={order} setLatLng={setLatLng} setMapVisible={setMapVisible} />
                ))}
              </OrdersContainer>
            ) : (
              <Center>
                <H4 bold>No Orders Yet</H4>
              </Center>
            )}
          </>
        )}
      </Container>
      <Navigation />
      <Map mapVisible={mapVisible} handleClose={handleClose} lat={latLng.lat} lng={latLng.lng} />
      <ToastContainer>
        <Toast />
      </ToastContainer>
    </Common>
  );
};

export default Process;
