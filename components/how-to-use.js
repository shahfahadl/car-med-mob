// ----------------------------- Example default code ------------------

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

// const CustomTextInput = ({ label, ...rest }) => {
//   return (
//     <TextInputContainer>
//       <Label>{label}</Label>
//       <Input {...rest} />
//     </TextInputContainer>
//   );
// };

// export default CustomTextInput;

// ------------------------------------- Example common file ------------------------------

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