import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUser } from "../../hooks/watchOrder";
import { CustomOutlineButton } from "../../elements/button";
import { colors, fonts } from "../../utility/theme";
import UserService from "../../utility/services/user";
import { useNavigation } from "@react-navigation/native";
import { ImageContainer, StarElement } from "../../elements/common";
import { CommonUtility } from "../../utility/common";
import Toast from "react-native-toast-message";

const Container = styled.View`
  padding-top: 50px;
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
  row-gap: 5px;
`;

const RequestsContainer = styled.View`
  margin: 10px;
  border-radius: 10px;
  background-color: ${colors.halfBlack};
  padding: 10px;
  height: 60vh;
  over-flow: auto;
  width: calc(100% - 40px);
  display: flex;
  row-gap: 10px;
`;

const RequestContainer = styled.View`
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  width: calc(100%);
  display: flex;
  flex-direction: row;
  row-gap: 10px;
`;

const Request = ({ request , id }) => {
  const navigation = useNavigation();

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
      console.log("Error : ", error);
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
        <FlexRow style={{marginBottom: "10px"}} >
          <H4 bold>Ratings &nbsp;</H4>
          {ratingValue === 0 ? (
            <H4 light>Not rated Yet</H4>
          ) : (
            <StarElement starValue={ratingValue} />
          )}
        </FlexRow>
        <CustomOutlineButton onPress={acceptRequest} width="max-content" color={colors.green}>Accept</CustomOutlineButton>
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
  async function cancelOrder() {
    try {
      UserService.cancelOrder({ id: order.id });
      Toast.show({
        type: "success",
        text1: "Order canceled",
      });
      navigation.navigate("User_order");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Navigation />
      <Details>
        <H4 bold style={{ fontSize: "20px" }}>Order Details</H4>
        <FlexRow>
          <H4 bold>Price &nbsp;</H4>
          <H4>{order.bid}</H4>
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
        <FlexRow style={{columnGap: "10px"}} >
          <CustomOutlineButton color={colors.red} onPress={cancelOrder} >Cancel</CustomOutlineButton>
          <CustomOutlineButton color={colors.blue}>Update</CustomOutlineButton>
        </FlexRow>
      </Details>
      <Center>
        <H4 style={{fontSize: "20px"}} >Bids</H4>
        <RequestsContainer>
          {(order.requests?.length > 0)? order.requests.map((request) => (
            <Request request={request} id={orderId} />
            )):
            <Center>
              <H4>No Bids Yet</H4>
            </Center>
        
        }
        </RequestsContainer>
      </Center>
    </Container>
  );
};

export default SingleOrder;
