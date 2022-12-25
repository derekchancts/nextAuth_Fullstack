import React from 'react'
import Header from './Header'
import { Container } from '@mui/material'

const Layout = ({ children }) => {
  return (
    <Container >
      <Header />
      { children }
    </Container>
  )
}

export default Layout