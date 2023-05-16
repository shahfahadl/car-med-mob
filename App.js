import React, { useEffect, useState } from "react";
import { loadAsync } from "expo-font";
import Registration from "./pages/registration";
import InterRegular from "./assets/fonts/Inter-Regular.ttf";
import InterBold from "./assets/fonts/Inter-Black.ttf";
import Completed from "./pages/user/completed";
import Order from "./pages/user/order";
import Process from "./pages/user/process";
import SingleOrder from "./pages/user/singleOrder";
import AvailableOrders from "./pages/vendor/availableOrders";
import InProcessOrders from "./pages/vendor/inProcessOrders";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import VendorCompleted from "./pages/vendor/vendorCompleted";
import { ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await loadAsync({
        "Inter-Regular": InterRegular,
        "Inter-Bold": InterBold,
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  return (
    <>
      {fontsLoaded ? (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Registration"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="User_completed" component={Completed} />
            <Stack.Screen name="User_order" component={Order} />
            <Stack.Screen name="User_process" component={Process} />
            <Stack.Screen name="User_singleOrder" component={SingleOrder} />
            <Stack.Screen
              name="Vendor_availableOrders"
              component={AvailableOrders}
            />
            <Stack.Screen
              name="Vendor_inProcessOrders"
              component={InProcessOrders}
            />
            <Stack.Screen name="Vendor_completed" component={VendorCompleted} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <ActivityIndicator style={{ top: '50%', left: '50%' , transform: [{translateX: -10}]}} size="large" color={"black"} />
      )}
    </>
  );
}
