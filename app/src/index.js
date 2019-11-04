import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import CssBaseline from '@material-ui/core/CssBaseline'
import Menu from './menu/navbar'
import Items from './items'
import MenuBottom from './menu/bottom'
import * as serviceWorker from './serviceWorker'
import 'typeface-roboto'

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Menu>
      <Items />
    </Menu>
    <MenuBottom />
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
