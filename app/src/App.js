import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  ThemeProvider,
  createMuiTheme,
  responsiveFontSizes,
} from '@material-ui/core/styles'

import Content from './components/Content'


let theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
        },
        body: {
          background: '#fefefe',
          color: '#333',
        },
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#fefefe',
        color: '#333',
      },
    },
  },
})
theme = responsiveFontSizes(theme)


class App extends React.Component {

  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Content />
      </ThemeProvider>
    )
  }
}


export default App
