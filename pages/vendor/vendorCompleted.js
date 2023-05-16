import { View } from "react-native";
import React from "react";
import Navigation from "../../Layout/Navigation";
import styled from "styled-components/native";
import { borderRadius, colors, fonts } from "../../utility/theme";
import { orderVendorCompleted } from "../../hooks/watchOrder";
import { ImageContainer, StarElement } from "../../elements/common";
import { CommonUtility } from "../../utility/common";
import { Dimensions } from "react-native";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";
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
  border: 2px solid ${colors.halfBlack};
  padding: 20px;
  width: 95%;
  max-width: 600px;
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
            <H4>{CommonUtility.currencyFormat(order.bid)}</H4>
          </FlexRow>
        </View>
      </OrderTop>
      <OrderBottom>
        <FlexRow>
          <H4 bold>Order Id &nbsp;</H4>
          <H4>{order.id}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Name &nbsp;</H4>
          <H4>{order.userName}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Location &nbsp;</H4>
          <H4>{order.location}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Problem &nbsp;</H4>
          <H4>{order.problem}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Rating &nbsp;</H4>
          <H4>
            {!!order.rating ? (
              <StarElement starValue={order.rating} />
            ) : (
              "Not Rated Yet"
            )}
          </H4>
        </FlexRow>
      </OrderBottom>
    </OrderContainer>
  );
};

const VendorCompleted = () => {
  const { height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const { data: orders, loading } = orderVendorCompleted();
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
                  <OrderItem key={order.id} order={order} />
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
    </Common>
  );
};

export default VendorCompleted;
