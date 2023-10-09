import { View } from "react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUserCompleted } from "../../hooks/watchOrder";
import { borderRadius, colors, fonts } from "../../utility/theme";
import { CommonUtility } from "../../utility/common";
import { CustomOutlineButton } from "../../elements/button";
import { Popup } from "../../elements/common";
import { CustomTextInput, StarInput } from "../../elements/input";
import Toast from "react-native-toast-message";
import UserService from "../../utility/services/user";
import { StarElement } from "../../elements/common";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlockedComponent } from "../../components/blocked"; 

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
  gap: 10px;
`;

const OrderContainer = styled.View`
  display: flex;
  width: 95%;
  max-width: 400px;
  padding: 20px;
  border: 2px solid ${colors.halfBlack};
  ${borderRadius("5px")}
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
  width: 100%;
  gap: 10px;
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
        <FlexRow style={{ marginBottom: 15 }}>
          <H4 light bold>
            Price &nbsp;
          </H4>
          <H4 bold>{CommonUtility.currencyFormat(order.bid)}</H4>
        </FlexRow>
        {order.rating ? (
          <FlexRow>
            <H4 light bold>
              Rating &nbsp;
            </H4>
            <StarElement starValue={order.rating} />
          </FlexRow>
        ) : (
          <CustomOutlineButton
            onPress={handlePopup}
            color={colors.green}
            style={{ width: 140 }}
          >
            Rate Your Vendor
          </CustomOutlineButton>
        )}
      </Bottom>
    </OrderContainer>
  );
};

const Completed = () => {
  const { data: orders, loading } = orderUserCompleted();
  const [show, setShow] = useState(false);
  const { height } = Dimensions.get("window");
  const [apiLoading, setApiLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [blockedShow, setBlockedShow] = useState(false);
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
        setApiLoading(true);
        Toast.show({
          type: "info",
          text1: `Rating ${values.vendorName}`,
        });
        const payload = {
          vendorId: values.vendorId,
          rating: values.rating,
          id: values.id,
          review: values.review,
        };

        let res = await UserService.rateVendor(payload);
        if(res.response?.status === 405){
          setBlockedShow(true)
        }else{
          Toast.show({
            type: "success",
            text1: "Thanks for your feedback!",
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Some error occurred",
        });
      } finally {
        setApiLoading(false);
        setShow(false);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Please Rate The Vendor",
      });
    }
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
          </>
        )}
      </Container>
      <Navigation />
      <ToastContainer>
        <Toast />
      </ToastContainer>
      <Popup show={show} setShow={setShow}>
        <PopupContainer>
          <H4 bold style={{ fontSize: 25, marginBottom: 10 }}>
            Rate {values.vendorName}
          </H4>
          <StarInput
            style={{ margin: 10 }}
            starValue={values.rating}
            setStarValue={(value) => setValues({ ...values, rating: value })}
          />
          <CustomTextInput
            inverted
            labelColor={"black"}
            label="Review"
            width="60%"
            value={values.review}
            onChangeText={(e) => setValues((prev) => ({ ...prev, review: e }))}
            placeholder="A great experience"
          />
        </PopupContainer>
        <Buttons>
          <CustomOutlineButton
            style={{ marginLeft: "auto" }}
            color={colors.green}
            onPress={handleForm}
            loading={apiLoading}
          >
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
      <BlockedComponent blockedShow={blockedShow} setBlockedShow={setBlockedShow}/>
    </Common>
  );
};

export default Completed;
