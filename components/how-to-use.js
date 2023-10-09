// ----------------------------- Starting a page template ------------------

// import React from 'react'
// import styled from 'styled-components/native';
// import Toast from "react-native-toast-message";
// import { fonts } from '../utility/theme';

// const Common = styled.View`
//   width: 100%;
//   height: 100%;
//   ${fonts.fontFamilyRegular}
// `;

// const Container = styled.ScrollView`
//   width: 100%;
//   height: 100%;
// `;

// const PositionFixed = styled.View`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   z-index: 1;
// `;

// function App() {

//   return (
//     <Common>
//       <PositionFixed>
//           <Toast />
//           Place any thing you want to make position fixed
//       </PositionFixed>
//       <Container>
//         All components go here
//       </Container>
//     </Common>
//   )
// }

// export default App

// ------------------------------------- Component Template ------------------------------

// import React from 'react';
// import styled from 'styled-components/native';

// const TextInputContainer = styled.View`
//   background-color: red;
// `;

// const Label = styled.Text`
//   font-size: 16px;
//   font-weight: bold;
// `;

// const Input = styled.TextInput`
//   border: 1px solid black;
//   padding: 10px;
//   font-size: 16px;
// `;

// export const CustomTextInput = ({ label, ...rest }) => {
//   return (
//     <TextInputContainer>
//       <Label>{label}</Label>
//       <Input {...rest} />
//     </TextInputContainer>
//   );
// };
