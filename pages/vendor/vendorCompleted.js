import { View } from 'react-native'
import React from 'react'
import Navigation from '../../Layout/Navigation'
import styled from 'styled-components/native'
import { colors, fonts } from "../../utility/theme";
import { orderVendorCompleted } from "../../hooks/watchOrder";
import { ImageContainer } from "../../elements/common";
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
  box-shadow: 0px 0px 7px ${colors.boxShadow};
  padding: 20px;
  width: 95%;
  max-width: 400px;
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

const OrderTop = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const OrderBottom = styled.View`
    margin-top: 10px;
`;

const OrderItem = ({ order }) => {
  return (
    <OrderContainer>
      <OrderTop>
        <View>
          <ImageContainer image={order.userProfile} />
        </View>
        <View>
          <FlexRow>
            <H4 bold>Price &nbsp;</H4>
            <H4>PKR {order.bid}</H4>
          </FlexRow>
        </View>
      </OrderTop>
      <OrderBottom>
        <FlexRow>
          <H4 bold>
            Order Id &nbsp;
          </H4>
          <H4>{order.id}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>
            Name &nbsp;
          </H4>
          <H4>{order.userName}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>
            Location &nbsp;
          </H4>
          <H4>{order.location}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>
            Problem &nbsp;
          </H4>
          <H4>{order.problem}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>
            Rating &nbsp;
          </H4>
          <H4>{!!order.rating? order.rating : "Not Rated Yet" }</H4>
        </FlexRow>
      </OrderBottom>
    </OrderContainer>
  );
};

const VendorCompleted = () => {
  const { data: orders } = orderVendorCompleted();
  console.log(orders);
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
}

export default VendorCompleted