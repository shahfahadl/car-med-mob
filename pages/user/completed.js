import { View } from "react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUserCompleted } from "../../hooks/watchOrder";
import { colors, fonts } from "../../utility/theme";
import { CommonUtility } from "../../utility/common";
import { CustomOutlineButton } from "../../elements/button";
import { Popup } from "../../elements/common";
import { CustomTextInput, StarInput } from "../../elements/input";
import Toast from "react-native-toast-message";
import UserService from "../../utility/services/user";
import { StarElement } from "../../elements/common";

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
  flex-direction: column;
  margin-top: 20px;
`;

const PopupContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Buttons = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
  column-gap: 10px;
  margin-top: 20px;
`;

const OrderItem = ({ order, setPopup, setValues }) => {
  function handlePopup() {
    setValues({
      id: order.id,
      vendorId: order.vendorId,
      vendorName: order.vendorName,
    });
    setPopup(true);
  }

  return (
    <OrderContainer>
      <View>
        <FlexRow>
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
        <FlexRow style={{marginBottom: "5px"}} >
          <H4 light bold>
            Price &nbsp;
          </H4>
          <H4 bold>{CommonUtility.currencyFormat(order.bid)}</H4>
        </FlexRow>
        {order.rating?
        <FlexRow>
          <H4 light bold>
            Rating &nbsp;
          </H4>
          <StarElement starValue={order.rating} />
        </FlexRow>:
        
        <CustomOutlineButton onPress={handlePopup} color={colors.green} style={{width: "max-content"}} >
          Rate Your Vendor
        </CustomOutlineButton>
        }
      </Bottom>
    </OrderContainer>
  );
};

const Completed = () => {
  const { data: orders, loading } = orderUserCompleted();
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({
    rating: 0,
    id: null,
    review: "",
    vendorId: null,
    vendorName: "",
  });
  async function handleForm() {
    if (values.rating > 0) {
      try {
        const payload = {
          vendorId: values.vendorId,
          rating: values.rating,
          id: values.id,
          review: values.review,
        };
        try {
          UserService.rateVendor(payload);
          Toast.show({
            type: "success",
            text1: "Thanks for your feedback!",
          });
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Invalid credentials",
          });
        } finally {
          setShow(false)
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Some error occurred",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Please Rate The Vendor",
      });
    }
  }

  return (
    <Container>
      <Navigation />
      {orders.length > 0 ? (
        <OrdersContainer>
          {orders?.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              setPopup={setShow}
              setValues={setValues}
            />
          ))}
        </OrdersContainer>
      ) : (
        <Center>
          <H4 bold>No Orders Yet</H4>
        </Center>
      )}
      <Popup show={show} setShow={setShow}>
        <PopupContainer>
          <H4 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Rate {values.vendorName}
          </H4>
          <StarInput
            style={{ margin: "10px 0" }}
            starValue={values.rating}
            setStarValue={(value) => setValues({ ...values, rating: value })}
          />
          <CustomTextInput
            label="Review"
            width="60%"
            value={values.review}
            onChangeText={(e) => setValues((prev) => ({ ...prev, review: e }))}
            placeholder="A great experience"
          />
        </PopupContainer>
        <Buttons>
          <CustomOutlineButton color={colors.green} onPress={handleForm}>
            Rate
          </CustomOutlineButton>
          <CustomOutlineButton
            color={colors.red}
            onPress={() => setShow(false)}
          >
            Close
          </CustomOutlineButton>
        </Buttons>
      </Popup>
    </Container>
  );
};

export default Completed;
