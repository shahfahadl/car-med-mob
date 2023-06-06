import { View, Text } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components/native";
import Navigation from "../../Layout/Navigation";
import { orderUser } from "../../hooks/watchOrder";
import { CustomOutlineButton } from "../../elements/button";
import { borderRadius, colors, fonts } from "../../utility/theme";
import UserService from "../../utility/services/user";
import { useNavigation } from "@react-navigation/native";
import { ImageContainer, Popup, StarElement } from "../../elements/common";
import { CommonUtility, carTypeOptions, skillOption } from "../../utility/common";
import Toast from "react-native-toast-message";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Map from "../../components/map";
import { CustomDatePicker, CustomDropdownInput, CustomTextInput, CustomTimePicker } from "../../elements/input";
import LocationSelector from "../../components/locationSelector";
import { OrderSchema } from "../../utility/validationSchema";

const Common = styled.View`
  width: 100%;
  height: 100%;
  padding-top: ${({ statusBarHeight }) => `${statusBarHeight}px`};
  ${fonts.fontFamilyRegular}
`;

const ToastContainer = styled.View`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 5;
`;

const Container = styled.ScrollView`
  margin-top: 60px;
  width: 100%;
  height: ${({ height }) => `${height - 60}px`};
`;

const Center = styled.View`
  display: flex;
  align-items: center;
  margin-top: 20px;
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

const Details = styled.View`
  padding: 20px;
  display: flex;
  gap: 5px;
`;

const RequestsContainer = styled.ScrollView`
  margin: 10px;
  ${borderRadius("5px")}
  background-color: ${colors.halfBlack};
  padding: 10px;
  height: ${({ height }) => height * 60};
  display: flex;
  width: 95%;
`;

const StyledSwitch = styled.Switch`

`;

const RequestContainer = styled.View`
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  ${borderRadius("5px")}
`;

const Buttons = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 20px;
  gap: 10px;
`;

const ShowMaps = styled.TouchableOpacity`
  padding: 0px 5px;
  border: 2px solid black;
  background-color: ${colors.yellowLight};
  ${borderRadius("15px")}
`;

const Request = ({ request, id }) => {
  const navigation = useNavigation();
  const [apiLoading, setApiLoading] = useState(false);

  const ratingValue = (() => {
    if (request.ratings.length === 0) return 0;
    let sum = 0;
    request.ratings.forEach((rating) => {
      sum += rating.rating;
    });
    let result = sum / request.ratings.length;

    return Math.round(result);
  })();

  async function acceptRequest() {
    try {
      setApiLoading(true);
      Toast.show({
        type: "info",
        text1: "Accepting Request",
      });
      const payload = {
        vendorId: request.vendorId,
        vendorName: request.vendorName,
        bid: request.bid,
        id: id,
        vendorProfile: request.vendorProfile,
      };
      UserService.acceptRequest(payload);
      Toast.show({
        type: "success",
        text1: "Request Accepted",
      });
      navigation.navigate("User_process");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An Error Ocurred",
      });
    } finally {
      setApiLoading(false);
    }
  }

  return (
    <RequestContainer>
      <View>
        <FlexRow>
          <H4 bold>Name &nbsp;</H4>
          <H4>{request.vendorName}</H4>
        </FlexRow>
        <FlexRow>
          <H4 bold>Contact &nbsp;</H4>
          <H4 light>Not Available</H4>
        </FlexRow>
        <FlexRow style={{ marginBottom: 10 }}>
          <H4 bold>Ratings &nbsp;</H4>
          {ratingValue === 0 ? (
            <H4 light>Not rated Yet</H4>
          ) : (
            <StarElement starValue={ratingValue} />
          )}
        </FlexRow>
        <CustomOutlineButton
          onPress={acceptRequest}
          color={colors.green}
          style={{
            alignSelf: "flex-start",
          }}
          loading={apiLoading}
        >
          Accept
        </CustomOutlineButton>
      </View>
      <View>
        <FlexRow>
          <H4 bold>Offer &nbsp;</H4>
          <H4>{CommonUtility.currencyFormat(request.bid)}</H4>
        </FlexRow>
        <ImageContainer image={request.vendorProfile} />
      </View>
    </RequestContainer>
  );
};

const SingleOrder = ({ route }) => {
  const { orderId } = route.params;
  const { data: order, loading } = orderUser(orderId);
  const navigation = useNavigation();
  const { height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const [apiLoading, setApiLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState({
    name: null,
    latitude: null,
    longitude: null
  });
  const [errors, setErrors] = useState({});
  const [latLng, setLatLng] = useState({
    lat: null,
    lng: null,
  });

  const [values, setValues] = useState({
    problem: "dentAndPaint",
    carType: "cars",
    bid: null,
    date: null,
    time: null
  });

  useEffect(() => {
    if (order) {
      setLocation({
        name: order.location,
        latitude: order.latLng?.lat,
        longitude: order.latLng?.lng
      })
      setValues({
        problem: order.problem,
        carType: order.carType,
        location: order.location,
        latLng: order.latLng,
        bid: order.bid,
        date: order.date,
        time: order.time
      })
    }
  }, [order]);

  async function cancelOrder() {
    try {
      setApiLoading(true);
      Toast.show({
        type: "info",
        text1: "Canceling Order",
      });
      UserService.cancelOrder({ id: order.id });
      Toast.show({
        type: "success",
        text1: "Order canceled",
      });
      navigation.navigate("User_order");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Some error ocurred",
      });
    } finally {
      setApiLoading(false);
    }
  }

  function handleClose(){
    setLatLng({
      lat: null,
      lng: null
    })
    setMapVisible(false)
  }

  function handleMapClick() {
    setLatLng({
      lat: order.latLng?.lat,
      lng: order.latLng?.lng,
    })
    setMapVisible(true);
  }

  const handleForm = async () => {
    OrderSchema.validate({...values, location: location.name}, { abortEarly: false })
      .then(async () => {
        const payload = {
          problem: values.problem,
          bid: parseInt(values.bid),
          carType: values.carType,
          location: location.name,
          latLng: {
            lat: location.latitude , 
            lng: location.longitude
          },
          id : orderId,
          date: appointment? values.date : "",
          time: appointment? values.time : ""
        };
        try {
          setApiLoading(true);
          Toast.show({
            type: "info",
            text1: "Updating Order",
          });
          await UserService.updateOrder(payload);
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

  return (
    <Common statusBarHeight={insets.top}>
      <Container height={height}>
        {loading ? (
          <ActivityIndicator size="large" color={"black"} />
        ) : (
          <>
            <Details>
              <H4 bold style={{ fontSize: 20 }}>
                Order Details
              </H4>
              <FlexRow>
                <H4 bold>Price &nbsp;</H4>
                <H4>{CommonUtility.currencyFormat(order.bid)}</H4>
              </FlexRow>
              <FlexRow>
                <H4 bold>Problem &nbsp;</H4>
                <H4>{order.problem}</H4>
              </FlexRow>
              <FlexRow style={{ alignItems: "center" }}>
                <H4 bold>Location &nbsp;</H4>
                <H4 light>{order.location} &nbsp;</H4>
                <ShowMaps onPress={handleMapClick}>
                  <H4>Show maps</H4>
                </ShowMaps>
              </FlexRow>
              <FlexRow>
                <H4 bold>Car Type &nbsp;</H4>
                <H4>{order.carType}</H4>
              </FlexRow>
              {order.date && (
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
              )}
              <FlexRow style={{ gap: 10, marginTop: 10 }}>
                <CustomOutlineButton
                  color={colors.red}
                  loading={apiLoading}
                  onPress={cancelOrder}
                >
                  Cancel
                </CustomOutlineButton>
                <CustomOutlineButton loading={apiLoading} color={colors.blue} onPress={()=>setShow(true)} >
                  Update
                </CustomOutlineButton>
              </FlexRow>
            </Details>
            <Center>
              <H4 style={{ fontSize: 20 }}>Bids</H4>
              <RequestsContainer height={Math.round(height / 100)}>
                {order.requests?.length > 0 ? (
                  order.requests.map((request) => (
                    <Request request={request} id={orderId} />
                  ))
                ) : (
                  <Center>
                    <H4>No Bids Yet</H4>
                  </Center>
                )}
              </RequestsContainer>
            </Center>
          </>
        )}
      </Container>
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
            autoSelect={false}
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
            color={colors.blue}
            onPress={handleForm}
            loading={apiLoading}
          >
            Update Order
          </CustomOutlineButton>
          <CustomOutlineButton
            color={colors.red}
            onPress={() => setShow(false)}
          >
            Close
          </CustomOutlineButton>
        </Buttons>
      </Popup>
      <ToastContainer>
        <Toast />
      </ToastContainer>
      <Navigation />
      <Map
        mapVisible={mapVisible}
        setLocation={setLocation}
        lat={latLng.lat}
        lng={latLng.lng}
        handleClose={handleClose}
      />
    </Common>
  );
};

export default SingleOrder;
