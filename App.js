import React from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import styled from 'styled-components/native';
import { fonts } from './utility/theme';
import Registration from './pages/registration';
import InterRegular from './assets/fonts/Inter-Regular.ttf'
import InterBold from './assets/fonts/Inter-Black.ttf'

const Common = styled.View`
  ${fonts.fontFamilyRegular}
  width: 100%;
  min-height: 100vh;
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
    <Common>
      <Registration />
    </Common>
  );
}