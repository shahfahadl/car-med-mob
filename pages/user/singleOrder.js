import { View, Text } from "react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUser } from "../../hooks/watchOrder";
import { CustomOutlineButton } from "../../elements/button";
import { borderRadius, colors, fonts } from "../../utility/theme";
import UserService from "../../utility/services/user";
import { useNavigation } from "@react-navigation/native";
import { ImageContainer, StarElement } from "../../elements/common";
import { CommonUtility } from "../../utility/common";
import Toast from "react-native-toast-message";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Common = styled.View`
  width: 100%;
  height: 100%;
  padding-top: ${({ statusBarHeight }) => `${statusBarHeight}px`};
  ${fonts.fontFamilyRegular}
`;

const ToastContainer = styled.View`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 5;
`;

const Container = styled.ScrollView`
  margin-top: 60px;
  width: 100%;
  height: ${({ height }) => `${height - 60}px`};
`;

const Center = styled.View`
  display: flex;
  align-items: center;
  margin-top: 20px;
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

const Details = styled.View`
  padding: 20px;
  display: flex;
  gap: 5px;
`;

const RequestsContainer = styled.ScrollView`
  margin: 10px;
  ${borderRadius("5px")}
  background-color: ${colors.halfBlack};
  padding: 10px;
  height: ${({ height }) => height * 60};
  display: flex;
  width: 95%;
`;

const RequestContainer = styled.View`
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  ${borderRadius("5px")}
`;

const Request = ({ request, id }) => {
  const navigation = useNavigation();
  const [apiLoading, setApiLoading] = useState(false);

  const ratingValue = (() => {
    if (request.ratings.length === 0) return 0;
    let sum = 0;
    request.ratings.forEach((rating) => {
      sum += rating.rating;
    });
    let result = sum / request.ratings.length;

    return Math.round(result);
  })();

  async function acceptRequest() {
    try {
      setApiLoading(true);
      Toast.show({
        type: "info",
        text1: "Accepting Request",
      });
      const payload = {
        vendorId: request.vendorId,
        vendorName: request.vendorName,
        bid: request.bid,
        id: id,
        vendorProfile: request.vendorProfile,
      };
      UserService.acceptRequest(payload);
      Toast.show({
        type: "success",
        text1: "Request Accepted",
      });
      navigation.navigate("User_process");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An Error Ocurred",
      });
    } finally {
      setApiLoading(false);
    }
  }

  return (
    <RequestContainer>
      <View>
        <FlexRow>
          <H4 bold>Name &nbsp;</H4>
          <H4>{request.vendorName}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Contact &nbsp;</H4>
          <H4 light>Not Available</H4>
        </FlexRow>
        <FlexRow style={{ marginBottom: 10 }}>
          <H4 bold>Ratings &nbsp;</H4>
          {ratingValue === 0 ? (
            <H4 light>Not rated Yet</H4>
          ) : (
            <StarElement starValue={ratingValue} />
          )}
        </FlexRow>
        <CustomOutlineButton
          onPress={acceptRequest}
          color={colors.green}
          style={{
            alignSelf: "flex-start",
          }}
          loading={apiLoading}
        >
          Accept
        </CustomOutlineButton>
      </View>
      <View>
        <FlexRow>
          <H4 bold>Offer &nbsp;</H4>
          <H4>{CommonUtility.currencyFormat(request.bid)}</H4>
        </FlexRow>
        <ImageContainer image={request.vendorProfile} />
      </View>
    </RequestContainer>
  );
};

const SingleOrder = ({ route }) => {
  const { orderId } = route.params;
  const { data: order, loading } = orderUser(orderId);
  const navigation = useNavigation();
  const { height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const [ apiLoading , setApiLoading ] = useState(false)

  async function cancelOrder() {
    try {
      setApiLoading(true)
      Toast.show({
        type: "info",
        text1: "Canceling Order",
      });
      UserService.cancelOrder({ id: order.id });
      Toast.show({
        type: "success",
        text1: "Order canceled",
      });
      navigation.navigate("User_order");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Some error ocurred",
      });
    } finally {
      setApiLoading(false)
    }
  }

  return (
    <Common statusBarHeight={insets.top}>
      <Container height={height}>
        {loading ? (
          <ActivityIndicator size="large" color={"black"} />
        ) : (
          <>
            <Details>
              <H4 bold style={{ fontSize: 20 }}>
                Order Details
              </H4>
              <FlexRow>
                <H4 bold>Price &nbsp;</H4>
                <H4>{CommonUtility.currencyFormat(order.bid)}</H4>
              </FlexRow>
              <FlexRow>
                <H4 bold>Problem &nbsp;</H4>
                <H4>{order.problem}</H4>
              </FlexRow>
              <FlexRow>
                <H4 bold>Location &nbsp;</H4>
                <H4>{order.location}</H4>
              </FlexRow>
              <FlexRow>
                <H4 bold>Car Type &nbsp;</H4>
                <H4>{order.carType}</H4>
              </FlexRow>
              <FlexRow style={{ gap: 10, marginTop: 10 }}>
                <CustomOutlineButton color={colors.red} loading={apiLoading} onPress={cancelOrder}>
                  Cancel
                </CustomOutlineButton>
                <CustomOutlineButton loading={apiLoading} color={colors.blue}>
                  Update
                </CustomOutlineButton>
              </FlexRow>
            </Details>
            <Center>
              <H4 style={{ fontSize: 20 }}>Bids</H4>
              <RequestsContainer height={Math.round(height / 100)}>
                {order.requests?.length > 0 ? (
                  order.requests.map((request) => (
                    <Request request={request} id={orderId} />
                  ))
                ) : (
                  <Center>
                    <H4>No Bids Yet</H4>
                  </Center>
                )}
              </RequestsContainer>
            </Center>
          </>
        )}
      </Container>
      <ToastContainer>
        <Toast />
      </ToastContainer>
      <Navigation />
    </Common>
  );
};

export default SingleOrder;
