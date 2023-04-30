import { View } from 'react-native'
import React from 'react'
import Navigation from '../../Layout/Navigation'
import styled from 'styled-components/native'
import { colors, fonts } from "../../utility/theme";
import { orderVendorProcess } from "../../hooks/watchOrder";
import { ImageContainer } from "../../elements/common";
import { CustomOutlineButton } from "../../elements/button";
import VendorService from '../../utility/services/vendor';
import Toast from "react-native-toast-message";
import { CommonUtility } from '../../utility/common';

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
  column-gap: 20px;
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
  justify-content: end;
  width:100%;
  column-gap: 10px;
`;

const OrderItem = ({ order }) => {

  async function cancelOrder(){
    try{
      await VendorService.cancelOrder({id:order.id});
      Toast.show({
        type: "success",
        text1: "Order Canceled",
      });
    }catch(error){
      console.log(error)
    }
  }

  async function completeOrder(){
    try{
      await VendorService.completeOrder({id:order.id});
      Toast.show({
        type: "success",
        text1: "Order Completed",
      });
    }catch(error){
      console.log(error)
    }
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
            <ShowMaps>
              <H4>Show maps</H4>
            </ShowMaps>
          </FlexRow>
          <FlexRow>
            <H4 bold>Problem &nbsp;</H4>
            <H4>{order.problem}</H4>
          </FlexRow>
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
        <CustomOutlineButton color={colors.red} onPress={cancelOrder}>
          Cancel
        </CustomOutlineButton>
        <CustomOutlineButton color={colors.green} onPress={completeOrder}>
          Complete
        </CustomOutlineButton>
      </Buttons>
    </OrderContainer>
  );
};

const InProcessOrders = () => {
  const { data: orders } = orderVendorProcess();
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

export default InProcessOrders