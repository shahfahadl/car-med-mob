import { View } from "react-native";
import React from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUserProcess } from "../../hooks/watchOrder";
import { colors, fonts } from "../../utility/theme";
import { CommonUtility } from "../../utility/common";
import { CustomOutlineButton } from "../../elements/button";

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
  width: 95%;
  max-width: 400px;
  padding: 20px;
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

const OrderItem = ({ order }) => {
  return (
    <OrderContainer>
      <View>
        <FlexRow style={{marginBottom: "10px"}} >
          <H4 bold>Vendor Name &nbsp;</H4>
          <H4>{order.vendorName}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Car Type &nbsp;</H4>
          <H4>{order.carType}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Problem &nbsp;</H4>
          <H4>{order.problem}</H4>
        </FlexRow>
      </View>
      <Bottom>
        <FlexRow>
          <H4 light bold>
            Price &nbsp;
          </H4>
          <H4 bold>{CommonUtility.currencyFormat(order.bid)}</H4>
        </FlexRow>
        <CustomOutlineButton color={colors.green}>Rate Your Vendor</CustomOutlineButton>
      </Bottom>
    </OrderContainer>
  );
};

const Completed = () => {

  const { data: orders, loading } = orderUserProcess();

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
  )
}

export default Completed