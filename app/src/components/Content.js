import React from 'react'
import Container from '@material-ui/core/Container'

import ArrowUp from './ArrowUp'
import Header from './Header'
import Search from './Search'

class Content extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div id="top" />
        <Header />
        <Container maxWidth="xl">
          <Search />
          <ArrowUp/>
        </Container>
      </React.Fragment>
    )
  }
}


export default Content
