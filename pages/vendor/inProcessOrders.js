import { View } from "react-native";
import React, { useState } from "react";
import Navigation from "../../Layout/Navigation";
import styled from "styled-components/native";
import { borderRadius, colors, fonts } from "../../utility/theme";
import { orderVendorProcess } from "../../hooks/watchOrder";
import { ImageContainer } from "../../elements/common";
import { CustomOutlineButton } from "../../elements/button";
import VendorService from "../../utility/services/vendor";
import Toast from "react-native-toast-message";
import { CommonUtility } from "../../utility/common";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Map from "../../components/map";
import { BlockedComponent } from "../../components/blocked"; 

const Common = styled.View`
  padding-top: ${({ statusBarHeight }) => `${statusBarHeight}px`};
  width: 100%;
  height: 100%;
  ${fonts.fontFamilyRegular}
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
  gap: 10px;
`;

const OrderContainer = styled.View`
  border: 2px solid ${colors.halfBlack};
  padding: 20px;
  width: 95%;
  max-width: 600px;
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

const OrderTop = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const OrderBid = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 20px 0;
`;

const Buttons = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
`;

const OrderItem = ({ order ,   setLatLng, setMapVisible , setBlockedShow }) => {
  const [apiLoading, setApiLoading] = useState(false);
  async function cancelOrder() {
    try {
      setApiLoading(true);
      Toast.show({
        type: "info",
        text1: "Canceling Order",
      });
      let res = await VendorService.cancelOrder({ id: order.id });
      if(res.response?.status === 405){
        setBlockedShow(true)
      }else{
        Toast.show({
          type: "success",
          text1: "Order Canceled",
        });
      }
    } catch (error) {
      Toast.show({
        type: "info",
        text1: "An Error Ocurred",
      });
    } finally {
      setApiLoading(false);
    }
  }

  async function completeOrder() {
    try {
      setApiLoading(true);
      Toast.show({
        type: "info",
        text1: "Completing Order",
      });
      let res = await VendorService.completeOrder({ id: order.id });
      if(res.response?.status === 405){
        setBlockedShow(true)
      }else{
        Toast.show({
          type: "success",
          text1: "Order Completed",
        });
      }
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
      lat: order.latLng.lat,
      lng: order.latLng.lng
    })
    setMapVisible(true)
  }

  return (
    <OrderContainer>
      <OrderTop>
        <View>
          <ImageContainer image={order.userProfile} />
        </View>
        <View>
          <FlexRow>
            <H4 bold>Name &nbsp;</H4>
            <H4>{order.userName}</H4>
          </FlexRow>
          <FlexRow style={{ alignItems: "center" }}>
            <H4 bold>Location &nbsp;</H4>
            <H4 light>{order.location} &nbsp;</H4>
            <ShowMaps onPress={handleShowMaps} >
              <H4>Show maps</H4>
            </ShowMaps>
          </FlexRow>
          <FlexRow>
            <H4 bold>Problem &nbsp;</H4>
            <H4>{order.problem}</H4>
          </FlexRow>
          <FlexRow>
            <H4 bold>Contact &nbsp;</H4>
            <H4>{order.contact}</H4>
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
      </OrderTop>
      <OrderBid>
        <FlexRow>
          <H4 light bold>
            Price &nbsp;
          </H4>
          <H4 bold>{CommonUtility.currencyFormat(order.bid)}</H4>
        </FlexRow>
      </OrderBid>
      <Buttons>
        <CustomOutlineButton
          style={{ marginLeft: "auto" }}
          color={colors.red}
          onPress={cancelOrder}
          loading={apiLoading}
        >
          Cancel
        </CustomOutlineButton>
        <CustomOutlineButton
          color={colors.green}
          onPress={completeOrder}
          loading={apiLoading}
        >
          Complete
        </CustomOutlineButton>
      </Buttons>
    </OrderContainer>
  );
};

const InProcessOrders = () => {
  const { height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const { data: orders, loading } = orderVendorProcess();
  const [mapVisible, setMapVisible] = useState(false);
  const [latLng, setLatLng] = useState({
    lat: null,
    lng: null,
  });
  const [blockedShow, setBlockedShow] = useState(false);
  function handleClose (){
    setMapVisible(false)
  }

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
                  <OrderItem key={order.id} order={order} setLatLng={setLatLng} setMapVisible={setMapVisible} setBlockedShow={setBlockedShow} />
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
      <ToastContainer>
        <Toast />
      </ToastContainer>
      <BlockedComponent blockedShow={blockedShow} setBlockedShow={setBlockedShow}/>
      <Map mapVisible={mapVisible} handleClose={handleClose} lat={latLng.lat} lng={latLng.lng} />
    </Common>
  );
};

export default InProcessOrders;
