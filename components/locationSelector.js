// import React, { useState, useEffect } from 'react';
// import { View, Button } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// // import Geocoder from 'react-native-geocoding';

// const LocationSelector = () => {
//   const [location, setLocation] = useState(null);
//   const [locationName, setLocationName] = useState(null);

//   useEffect(() => {
//     // Geolocation.requestAuthorization('whenInUse').then((permission) => {
//     //   if (permission === 'granted') {
//     //     Geolocation.getCurrentPosition({
//     //       timeout: 5000,
//     //     }).then((position) => {
//     //       setLocation({
//     //         latitude: position.coords.latitude,
//     //         longitude: position.coords.longitude,
//     //       });
//     //       console.log({
//     //           latitude: position.coords.latitude,
//     //           longitude: position.coords.longitude,
//     //         })

//     //       // Geocoder.from(position.coords.latitude, position.coords.longitude)
//     //       //   .then((json) => {
//     //       //     const addressComponent = json.results[0].address_components[0];
//     //       //     setLocationName(addressComponent.short_name);
//     //       //   })
//     //       //   .catch((error) => console.warn(error));
//     //     });
//     //   }
//     // });
//     async function ok (){
//       const lctn = await Geolocation.getCurrentPosition()
//       console.log(lctn)
//     }
//     ok()
//     // .then((position) => {
//             // setLocation({
//             //   latitude: position.coords.latitude,
//             //   longitude: position.coords.longitude,
//             // });
//             // console.log({
//             //     latitude: position.coords.latitude,
//             //     longitude: position.coords.longitude,
//             //   })
  
//             // Geocoder.from(position.coords.latitude, position.coords.longitude)
//             //   .then((json) => {
//             //     const addressComponent = json.results[0].address_components[0];
//             //     setLocationName(addressComponent.short_name);
//             //   })
//             //   .catch((error) => console.warn(error));
//           // });
//   }, []);

//   const handlePress = () => {
//     // Geolocation.requestAuthorization('whenInUse').then((permission) => {
//     //   if (permission === 'granted') {
//     //     Geolocation.getCurrentPosition({
//     //       timeout: 5000,
//     //     }).then((position) => {
//     //       setLocation({
//     //         latitude: position.coords.latitude,
//     //         longitude: position.coords.longitude,
//     //       });

//     //       // Geocoder.from(position.coords.latitude, position.coords.longitude)
//     //       //   .then((json) => {
//     //       //     const addressComponent = json.results[0].address_components[0];
//     //       //     setLocationName(addressComponent.short_name);
//     //       //   })
//     //       //   .catch((error) => console.warn(error));
//     //     });
//     //   }
//     // });
//   };

//   return (
//     <View>
//       <Button 
//       // onPress={handlePress} 
//       >
//         Get Location
//       </Button>
//     </View>
//   );
// };

// export default LocationSelector;