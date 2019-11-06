import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Routes from './routes'
import theme from './theme'
import Menu from './menu/navbar'
import MenuBottom from './menu/bottom'
import * as serviceWorker from './serviceWorker'
import 'typeface-roboto'

ReactDOM.render(
  <Router>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Menu>
        <Routes />
      </Menu>
      <MenuBottom />
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
