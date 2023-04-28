import { View } from "react-native";
import React, { useState } from "react";
import Navigation from "../../Layout/Navigation";
import styled from "styled-components/native";
import { colors, fonts } from "../../utility/theme";
import { orderVendorPending } from "../../hooks/watchOrder";
import { ImageContainer, Popup } from "../../elements/common";
import { CustomOutlineButton } from "../../elements/button";
import { useAuth } from "../../contexts/auth";
import VendorService from "../../utility/services/vendor";
import Toast from "react-native-toast-message";
import { CustomTextInput } from "../../elements/input";

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

const OrderBids = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
`;

const Buttons = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
  column-gap: 10px;
`;

const OrderItem = ({ order, user, setPopup, setValues, values }) => {
  const myBid =
    order.requests.find((request) => request.vendorId === user.id)?.bid || null;

  async function acceptOrder() {
    try {
      const payload = {
        vendorId: user.id,
        vendorName: user.name,
        price: order.bid,
        id: order.id,
        carType: order.carType,
        location: order.location,
        problem: order.problem,
        userId: order.userId,
        userName: order.userName,
      };
      await VendorService.acceptOrder(payload);
      Toast.show({
        type: "success",
        text1: "Order Accepted",
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handlePopup() {
    setValues({
      id: order.id,
      request:{
        vendorId: user.id,
        vendorName: user.name,
        vendorProfile: user.profile,
      }
    });
    setPopup(true);
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
      <OrderBids>
        <FlexRow>
          <H4 light bold>
            Bid &nbsp;
          </H4>
          <H4 bold>PKR {order.bid}</H4>
        </FlexRow>
        <FlexRow>
          {myBid ? (
            <>
              <H4 light bold>
                My Bid &nbsp;
              </H4>
              <H4 bold>PKR {myBid}</H4>
            </>
          ) : (
            <H4 light bold>
              No Bid Yet
            </H4>
          )}
        </FlexRow>
      </OrderBids>
      <Buttons>
        <CustomOutlineButton color={colors.green} onPress={acceptOrder}>
          Accept
        </CustomOutlineButton>
        <CustomOutlineButton color={colors.blue} onPress={handlePopup}>
          {myBid ? "Update Bid" : "Bid"}
        </CustomOutlineButton>
      </Buttons>
    </OrderContainer>
  );
};

const AvailableOrders = () => {
  const { user } = useAuth();
  const { data: orders } = orderVendorPending();
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({
    id: null,
    request: {
      vendorId: user?.id,
      vendorName: user?.name,
      bid: null,
      vendorProfile: user?.profile,
    },
  });

  console.log(orders)

  const handleForm = async () => {
    if(values.request.bid){
      try {
        await VendorService.placeBid(values);
      } catch (error) {
        Toast.show({
          type: "success",
          text1: "Invalid Credentials",
        });
      } finally {
        Toast.show({
          type: "success",
          text1: "Bid Placed",
        });
        setShow(false)
      }
    }else{
      Toast.show({
        type: "error",
        text1: "Bid not placed",
      });
    }
  };

  return (
    <Container>
      <Navigation />
      {orders.length > 0 ? (
        <OrdersContainer>
          {orders?.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              user={user}
              setValues={setValues}
              values={values}
              setPopup={setShow}
            />
          ))}
        </OrdersContainer>
      ) : (
        <Center>
          <H4 bold>No Orders Yet</H4>
        </Center>
      )}
      <Popup show={show} setShow={setShow}>
        <Center>
          <H4 bold style={{ fontSize: "20px" }}>Place Your Bid</H4>
        </Center>
        <CustomTextInput
          label={"Your Bid"}
          placeholder="3000"
          value={values.request.bid}
          onChangeText={(e) =>
            setValues((prev) => ({
              ...prev,
              request: { ...prev.request, bid: e },
            }))
          }
          width="70%"
        />
        <Buttons style={{marginTop: "10px"}} >
          <CustomOutlineButton color={colors.green} onPress={handleForm}>
            Place Bid
          </CustomOutlineButton>
          <CustomOutlineButton color={colors.red} onPress={()=>setShow(false)} >
            Close
          </CustomOutlineButton>
        </Buttons>
      </Popup>
    </Container>
  );
};

export default AvailableOrders;
