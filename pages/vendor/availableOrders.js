import { View, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import Navigation from "../../Layout/Navigation";
import styled from "styled-components/native";
import { borderRadius, colors, fonts } from "../../utility/theme";
import { orderVendorPending } from "../../hooks/watchOrder";
import { ImageContainer, Popup } from "../../elements/common";
import { CustomOutlineButton } from "../../elements/button";
import { useAuth } from "../../contexts/auth";
import VendorService from "../../utility/services/vendor";
import Toast from "react-native-toast-message";
import { CustomTextInput } from "../../elements/input";
import { CommonUtility } from "../../utility/common";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  margin-bottom: 10px;
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
  ${borderRadius("5px")}
  padding: 20px;
  width: 95%;
  max-width: 400px;
`;

const ToastContainer = styled.View`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 5;
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
  width: 100%;
  gap: 10px;
`;

const OrderItem = ({
  order,
  user,
  setPopup,
  setValues,
  apiLoading,
  setApiLoading,
}) => {
  const myBid =
    order.requests.find((request) => request.vendorId === user.id)?.bid || null;

  async function acceptOrder() {
    try {
      setApiLoading(true);
      Toast.show({
        type: "info",
        text1: "Accepting Order",
      });
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
      Toast.show({
        type: "error",
        text1: "An Error Ocurred",
      });
    } finally {
      setApiLoading(false);
    }
  }

  function handlePopup() {
    setValues({
      id: order.id,
      request: {
        vendorId: user.id,
        vendorName: user.name,
        vendorProfile: user.profile,
      },
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
          <H4 bold>{CommonUtility.currencyFormat(order.bid)}</H4>
        </FlexRow>
        <FlexRow>
          {myBid ? (
            <>
              <H4 light bold>
                My Bid &nbsp;
              </H4>
              <H4 bold>{CommonUtility.currencyFormat(myBid)}</H4>
            </>
          ) : (
            <H4 light bold>
              No Bid Yet
            </H4>
          )}
        </FlexRow>
      </OrderBids>
      <Buttons>
        <CustomOutlineButton
          color={colors.green}
          loading={apiLoading}
          onPress={acceptOrder}
        >
          Accept
        </CustomOutlineButton>
        <CustomOutlineButton
          color={colors.blue}
          loading={apiLoading}
          onPress={handlePopup}
        >
          {myBid ? "Update Bid" : "Bid"}
        </CustomOutlineButton>
      </Buttons>
    </OrderContainer>
  );
};

const AvailableOrders = () => {
  const { user } = useAuth();
  const { data: orders, loading } = orderVendorPending();
  const [show, setShow] = useState(false);
  const { height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const [apiLoading, setApiLoading] = useState(false);
  const [values, setValues] = useState({
    id: null,
    request: {
      vendorId: user?.id,
      vendorName: user?.name,
      bid: null,
      vendorProfile: user?.profile,
    },
  });

  const handleForm = async () => {
    if (values.request.bid) {
      try {
        setApiLoading(true);
        Toast.show({
          type: "info",
          text1: "Placing Bid",
        });
        await VendorService.placeBid(values);
        Toast.show({
          type: "success",
          text1: "Bid Placed",
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Invalid Credentials",
        });
      } finally {
        setApiLoading(false);
        setShow(false);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Bid not placed",
      });
    }
  };

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
                    user={user}
                    setValues={setValues}
                    values={values}
                    setPopup={setShow}
                    apiLoading={apiLoading}
                    setApiLoading={setApiLoading}
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
        <Center>
          <H4 bold style={{ fontSize: 25 }}>
            Place Your Bid
          </H4>
        </Center>
        <CustomTextInput
          inverted
          labelColor={"black"}
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
        <Buttons style={{ marginTop: 10 }}>
          <CustomOutlineButton
            color={colors.green}
            loading={apiLoading}
            onPress={handleForm}
          >
            Place Bid
          </CustomOutlineButton>
          <CustomOutlineButton
            color={colors.red}
            onPress={() => setShow(false)}
          >
            Close
          </CustomOutlineButton>
        </Buttons>
      </Popup>
    </Common>
  );
};

export default AvailableOrders;
