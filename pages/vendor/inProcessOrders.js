import { View, Text } from 'react-native'
import React from 'react'
import Navigation from '../../Layout/Navigation'
import styled from 'styled-components/native'

const Container = styled.View`
  padding-top: 50px;
`

const InProcessOrders = () => {

  return (
      <Container>
        <Navigation />
        <Text>In Process Orders</Text>
      </Container>
  )
}

export default InProcessOrders