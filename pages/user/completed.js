import { View, Text } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'
import Navigation from '../../Layout/Navigation'

const Container = styled.View`
  padding-top: 50px;
`

const Completed = () => {
  return (
      <Container>
        <Navigation />
        <Text>completed</Text>
      </Container>
  )
}

export default Completed