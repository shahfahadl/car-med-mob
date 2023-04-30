import { View, Text } from "react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUserPending } from "../../hooks/watchOrder";
import { colors, fonts } from "../../utility/theme";
import { arrowRight } from "../../Layout/importingImages";
import plusCircle from '../../assets/plus-circle.svg'
import { Popup } from "../../elements/common";
import { CustomDropdownInput, CustomTextInput } from "../../elements/input"
import { CommonUtility, carTypeOptions, cities, skillOption } from "../../utility/common";
import LocationSelector from "../../components/locationSelector";
import { CustomOutlineButton } from "../../elements/button";
import UserService from "../../utility/services/user";
import { useAuth } from "../../contexts/auth";
import { OrderSchema } from "../../utility/validationSchema";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  padding-top: 50px;
  width: 100%;
  min-height: calc(100vh - 60px);
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

const OrderNowContainer = styled.TouchableOpacity`
  position: fixed;
  bottom: 20px;
  left: calc(50% - 60px );
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

const OrderNow = ({setPopup}) => {
  return(
    <OrderNowContainer onPress={()=>setPopup(true)} >
      <IconContainer source={plusCircle} />
      <H4 style={{color: colors.green }} >Get Your Car Fixed!</H4>
    </OrderNowContainer>
  )
}

const OrderItem = ({ order }) => {

  const navigation = useNavigation()

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
          <H4 bold>{CommonUtility.currencyFormat(order.bid)}</H4>
        </FlexRow>
      </OrderLeft>
      <OrderRight onPress={()=> navigation.navigate("User_singleOrder", { orderId: order.id }) } >
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
  const [ show, setShow ] = useState(false)
  const [ errors, setErrors ] = useState({})
  const { user } = useAuth()
  const [ values , setValues ] = useState({
    problem: "dentAndPaint",
    carType: "cars",
    location: "Nowshera",
    latLng: {
      lat: 33.9956777,
      lng: 71.9075292,
    },
    bid: null,
  })

  const handleForm = async () => {
    OrderSchema.validate(values, { abortEarly: false })
    .then(async () => {
      const payload = {
        problem: values.problem,
        bid: parseInt(values.bid),
        carType: values.carType,
        location: values.location,
        userId: user.id,
        userName: user.name,
        userProfile: user.profile,
        latLng: values.latLng,
        requests: []
      }
      try {
        UserService.order(payload);
        Toast.show({
          type: "success",
          text1: "Order Placed",
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Invalid Credentials",
        });
      } finally {
        setShow(false)
      }
    })
    .catch((validationErrors) => {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      console.log(errors)
      setErrors(errors);
      Toast.show({
        type: "error",
        text1: "Form Values Incorrect",
      });
    });
  }

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
      <OrderNow setPopup={setShow} />
      <Popup show={show} setShow={setShow} >
        <Center>
          <H4 style={{fontSize: "20px"}} >Order Now</H4>
        </Center>
        <FlexRow style={{columnGap: "10px"}} >
          <CustomDropdownInput 
            label="Problem"
            width="40%"
            options={skillOption}
            selectedValue={values.problem}
            onValueChange={(value) => setValues((prev)=>({...prev,problem:value}))}
          />
          <CustomDropdownInput 
            label="Car Type"
            width="40%"
            options={carTypeOptions}
            selectedValue={values.carType}
            onValueChange={(value) => setValues((prev)=>({...prev,carType:value}))}
          />
        </FlexRow>
        <FlexRow style={{columnGap: "10px", margin: "0 10px"}} >
          <CustomDropdownInput 
            label="Location"
            width="40%"
            options={cities}
            selectedValue={values.location}
            onValueChange={(value) => setValues((prev)=>({...prev,location:value.name , latLng: value.latLng}))}
          />
          <CustomTextInput
            value={values.bid}
            onChangeText={(e) => setValues((prev)=>({...prev,bid:e}))}
            width="40%"
            placeholder="PKR"
            label="My Bid"
          />
        </FlexRow>
        <Buttons>
          <CustomOutlineButton color={colors.green} onPress={handleForm}>
            Place Order
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

export default Order;
