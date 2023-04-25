import { View, Text } from 'react-native'
import React from 'react'
import Navigation from '../../Layout/Navigation'
import styled from 'styled-components/native'

const Container = styled.View`
  padding-top: 50px;
`

const AvailableOrders = () => {
  return (
      <Container>
        <Navigation />
        <Text>availableOrders</Text>
      </Container>
  )
}

export default AvailableOrders