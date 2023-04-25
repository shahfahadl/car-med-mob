import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUserPending } from "../../hooks/watchOrder";
import { colors, fonts } from "../../utility/theme";
import { arrowRight } from "../../Layout/importingImages";

const Container = styled.View`
  padding-top: 50px;
`;

const OrdersContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  display: flex;
  align-items: center;
  row-gap: 15px;
`;

const OrderContainer = styled.View`
  border-radius: 5px;
  over-flow: hidden;
  box-shadow: 0px 0px 7px ${colors.boxShadow};
  display: flex;
  flex-direction: row;
  width: 95%;
  max-width: 400px;
`;

const OrderLeft = styled.View`
  padding: 20px;
  width: calc(100% - 30px);
`;

const OrderRight = styled.TouchableOpacity`
  padding: 20px 5px;
  background-color: ${colors.yellow};
  display: flex;
  justify-content: center;
`;

const ShowMaps = styled.TouchableOpacity`
  padding: 0px 5px;
  border: 2px solid black;
  background-color: ${colors.yellowLight};
  width: max-content;
  border-radius: 15px;
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

const IconContainer = styled.Image`
  height: 20px;
  width: 20px;
`;

const Center = styled.View`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const RequestCount = styled.Text`
  position: absolute;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -8px;
  right: -5px;
  border-radius: 50%;
  background-color: ${colors.red};
  color: white;
`;

const OrderItem = ({ order }) => {
  return (
    <OrderContainer>
      <OrderLeft>
        <View>
          <FlexRow>
            <H4 bold>Car Type &nbsp;</H4>
            <H4>{order.carType}</H4>
          </FlexRow>
          <FlexRow style={{ alignItems: "center" }}>
            <H4 bold>Location &nbsp;</H4>
            <H4 light>{order.location} &nbsp;</H4>
            <ShowMaps>
              <H4>Show maps</H4>
            </ShowMaps>
          </FlexRow>
          <FlexRow>
            <H4 bold>Problem &nbsp;</H4>
            <H4>{order.problem}</H4>
          </FlexRow>
        </View>
        <FlexRow style={{ marginTop: "20px" }}>
          <H4 light bold>
            Bid &nbsp;
          </H4>
          <H4 bold>PKR {order.bid}</H4>
        </FlexRow>
      </OrderLeft>
      <OrderRight>
        {order.requests.length > 0 && (
          <RequestCount>{order.requests.length}</RequestCount>
        )}
        <IconContainer source={arrowRight} />
      </OrderRight>
    </OrderContainer>
  );
};

const Order = () => {
  const { data: orders, loading } = orderUserPending();

  return (
    <Container>
      <Navigation />
      {orders.length > 0 ? (
        <OrdersContainer>
          {orders?.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </OrdersContainer>
      ) : (
        <Center>
          <H4 bold>No Orders Yet</H4>
        </Center>
      )}
    </Container>
  );
};

export default Order;
