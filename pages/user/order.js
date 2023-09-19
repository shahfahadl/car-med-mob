import { View, ActivityIndicator, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUserPending } from "../../hooks/watchOrder";
import { borderRadius, colors, fonts } from "../../utility/theme";
import { arrowRight } from "../../Layout/importingImages";
import plusCircle from "../../assets/plus-circle.png";
import { Popup } from "../../elements/common";
import { CustomDatePicker, CustomDropdownInput, CustomTextInput, CustomTimePicker } from "../../elements/input";
import {
  CommonUtility,
  carTypeOptions,
  cities,
  skillOption,
} from "../../utility/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationSelector from "../../components/locationSelector";
import { CustomOutlineButton } from "../../elements/button";
import UserService from "../../utility/services/user";
import { useAuth } from "../../contexts/auth";
import { OrderSchema } from "../../utility/validationSchema";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import Map from "../../components/map";
import { use } from "react-devtools-core";

const Common = styled.View`
  width: 100%;
  height: 100%;
  padding-top: ${({ statusBarHeight }) => `${statusBarHeight}px`};
  ${fonts.fontFamilyRegular}
`;

const Container = styled.ScrollView`
  margin-top: 60px;
  width: 100%;
  height: ${({ height }) => `${height - 60}px`};
`;

const OrdersContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrderContainer = styled.View`
  border: 2px solid ${colors.halfBlack};
  ${borderRadius("5px")}
  display: flex;
  flex-direction: row;
  width: 95%;
  max-width: 600px;
  justify-content: space-between;
`;

const OrderLeft = styled.View`
  padding: 20px;
  height: 100%;
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

const StyledSwitch = styled.Switch`

`;

const Images = styled.Image`
  width: 20px;
  height: 20px;
`;

const Center = styled.View`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const RequestCount = styled.View`
  position: absolute;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -8px;
  right: -5px;
  background-color: ${colors.red};
  color: white;
  ${borderRadius("20px")}
`;

const OrderNowContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-100px);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background-color: ${colors.box};
  padding: 10px 20px;
  ${borderRadius("30px")}
  border: 2px solid ${colors.green};
`;

const Buttons = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 20px;
  gap: 10px;
`;

const ToastContainer = styled.View`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 5;
`;

const IconContainer = styled.Image`
  height: 20px;
  width: 20px;
`;

const OrderNow = ({ setPopup }) => {
  return (
    <OrderNowContainer onPress={() => setPopup(true)}>
      <H4 style={{ color: colors.green }}>Get Your Car Fixed!</H4>
      <Images source={plusCircle} />
    </OrderNowContainer>
  );
};

const OrderItem = ({ order , setLatLng, setMapVisible }) => {
  const navigation = useNavigation();
  const handleMapClick = () =>{
    setLatLng({
      lat: order.latLng.lat,
      lng: order.latLng.lng
    })
    setMapVisible(true)
  }
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
            <ShowMaps onPress={handleMapClick} >
              <H4>Show maps</H4>
            </ShowMaps>
          </FlexRow>
          <FlexRow>
            <H4 bold>Problem &nbsp;</H4>
            <H4>{order.problem}</H4>
          </FlexRow>
          {
            order.date &&
            <>
              <H4 bold>Appointment &nbsp;</H4>
            <FlexRow>
              <H4 bold>Date &nbsp;</H4>
              <H4>{order.date}</H4>
            </FlexRow>
            <FlexRow>
              <H4 bold>Time &nbsp;</H4>
              <H4>{order.time}</H4>
            </FlexRow>
            </>
          }
        </View>
        <FlexRow style={{ marginTop: 20 }}>
          <H4 light bold>
            Bid &nbsp;
          </H4>
          <H4 bold>{CommonUtility.currencyFormat(order.bid)}</H4>
        </FlexRow>
      </OrderLeft>
      <OrderRight
        onPress={() =>
          navigation.navigate("User_singleOrder", { orderId: order.id })
        }
      >
        {order.requests.length > 0 && (
          <RequestCount>
            <H4 style={{ color: "white" }}>{order.requests.length}</H4>
          </RequestCount>
        )}
        <IconContainer source={arrowRight} />
      </OrderRight>
    </OrderContainer>
  );
};

const Order = () => {
  const { data: orders, loading } = orderUserPending();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const { height } = Dimensions.get("window");
  const [apiLoading, setApiLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [mapVisible, setMapVisible] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [latLng, setLatLng] = useState({
    lat: null,
    lng: null
  });

  const [location, setLocation] = useState({
    name: null,
    latitude: null,
    longitude: null
  });
  const [values, setValues] = useState({
    problem: "dentAndPaint",
    carType: "cars",
    bid: null,
    date: null,
    time: null
  });

  const handleForm = async () => {
    OrderSchema.validate({...values, location: location.name}, { abortEarly: false })
      .then(async () => {
        const payload = {
          problem: values.problem,
          bid: parseInt(values.bid),
          carType: values.carType,
          location: location.name,
          userId: user.id,
          contact: user.contact,
          userName: user.name,
          userProfile: user.profile,
          latLng: {
            lat: location.latitude , 
            lng: location.longitude
          },
          requests: [],
          date: appointment? values.date : "",
          time: appointment? values.time : ""
        };
        try {
          setApiLoading(true);
          Toast.show({
            type: "info",
            text1: "Creating Order",
          });
          await UserService.order(payload);
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
          setShow(false);
          setApiLoading(false);
        }
      })
      .catch((validationErrors) => {
        const errors = {};
        validationErrors.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setErrors(errors);
        Toast.show({
          type: "error",
          text1: "Form Values Incorrect",
        });
      });
  };

  function handleClose(){
    setLatLng({
      lat: null,
      lng: null
    })
    setMapVisible(false)
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
                  <OrderItem key={order.id} order={order} setLatLng={setLatLng} setMapVisible={setMapVisible} />
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
      <OrderNow setPopup={setShow} />
      <Popup show={show} setShow={setShow}>
        <Center>
          <H4 bold style={{ fontSize: 25, marginBottom: 20 }}>
            Order Now
          </H4>
        </Center>
        <FlexRow style={{ gap: 10, marginBottom: 10 }}>
          <CustomDropdownInput
            inverted
            labelColor={"black"}
            label="Problem"
            width="55%"
            options={skillOption}
            selectedValue={values.problem}
            onValueChange={(value) =>
              setValues((prev) => ({ ...prev, problem: value }))
            }
            hint={errors.problem}
          />
          <CustomDropdownInput
            inverted
            labelColor={"black"}
            label="Car Type"
            width="40%"
            options={carTypeOptions}
            selectedValue={values.carType}
            onValueChange={(value) =>
              setValues((prev) => ({ ...prev, carType: value }))
            }
            hint={errors.carType}
          />
        </FlexRow>
        <FlexRow style={{ gap: 10, marginBottom: 10 }}>
          <LocationSelector
            setMapVisible={setMapVisible}
            location={location}
            setLocation={setLocation}
            labelColor={"black"}
            inverted={true}
            hint={errors.location}
          />
          <CustomTextInput
            labelColor={"black"}
            inverted={true}
            value={values.bid}
            onChangeText={(e) => setValues((prev) => ({ ...prev, bid: e }))}
            width="40%"
            placeholder="PKR"
            label="My Bid"
            hint={errors.bid}
          />
        </FlexRow>
        <FlexRow style={{ alignItems: "center" }} >
            <H4>
              Appointment
            </H4>
            <StyledSwitch value={appointment} onValueChange={(value)=> setAppointment(value) } />
        </FlexRow>
        { appointment && 
        <FlexRow style={{ gap: 10, marginBottom: 10 }} >
            <CustomDatePicker
              value={values.date}
              setValue={(data)=> setValues((prev)=>({...prev, date: data}))}
            />
            <CustomTimePicker
              value={values.time}
              setValue={(data)=> setValues((prev)=> ({...prev, time: data}))}
            />
        </FlexRow>
        }
        <Buttons>
          <CustomOutlineButton
            style={{ marginLeft: "auto" }}
            color={colors.green}
            onPress={handleForm}
            loading={apiLoading}
          >
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
      <Map
        mapVisible={mapVisible}
        setLocation={setLocation}
        lat={latLng.lat}
        lng={latLng.lng}
        handleClose={handleClose}
      />
      <ToastContainer>
        <Toast />
      </ToastContainer>
    </Common>
  );
};

export default Order;
