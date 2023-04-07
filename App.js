import React from 'react';
import styled from 'styled-components/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { fonts } from './utility/theme';
import Registration from './pages/registration';
import InterRegular from './assets/fonts/Inter-Regular.ttf'
import InterBold from './assets/fonts/Inter-Black.ttf'
import Toast from 'react-native-toast-message';
import Completed from './pages/user/completed'
import Order from './pages/user/order'
import Process from './pages/user/process'
import SingleOrder from './pages/user/singleOrder'
import AvailableOrders from './pages/vendor/availableOrders'
import InProcessOrders from './pages/vendor/inProcessOrders'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Common = styled.View`
  ${fonts.fontFamilyRegular}
  width: 100%;
  min-height: 100vh;
`;

const PositionFixed = styled.View`
  position: fixed;
  top: 0;
  right: 50%;
`;

export default function App() {
  const [customFontsLoaded] = useFonts({
    'Inter-Regular': InterRegular,
    'Inter-Bold': InterBold,
  });

  if (!customFontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Common>
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
          <Stack.Screen name="Vendor_availableOrders" component={AvailableOrders} />
          <Stack.Screen name="Vendor_inProcessOrders" component={InProcessOrders} />
        </Stack.Navigator>
      <PositionFixed>
        <Toast />
      </PositionFixed>
    </Common>
  </NavigationContainer>
  );
}