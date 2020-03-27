import React, { useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { BrowserRouter as Router } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Routes from './routes'
import { ThemeProvider } from '@material-ui/styles'
import indigo from '@material-ui/core/colors/indigo'
import { lightTheme, darkTheme } from './theme'
import Menu from './menu/navbar'
import MenuBottom from './menu/bottom'
import * as serviceWorker from './serviceWorker'
import api from './api/config'
import 'typeface-roboto'

const App = () => {
  // TODO: uglify data.json
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [isLightTheme, setIsLightTheme] = useState(prefersDarkMode)

  const changeBarColor = isLight => {
    const color = indigo[`${isLight ? 900 : 500}`]
    const meta = document.querySelector('[name=theme-color]')
    if (meta.content !== color) meta.content = color
  }

  const changeTheme = useCallback((toLight, changeDb = true) => {
    if (changeDb) api.setTheme(toLight)
    setIsLightTheme(toLight)
    changeBarColor(toLight)
  }, [])

  useEffect(() => {
    (async () => {
      const isLight = await api.getTheme()
      if (isLight !== isLightTheme) changeTheme(isLight, false)
    })()
  }, [isLightTheme, changeTheme])

  // set chrome bar color
  changeBarColor(isLightTheme)

  return (
    <Router basename={`${process.env.PUBLIC_URL}/`}>
      <ThemeProvider theme={isLightTheme ? darkTheme : lightTheme}>
        <CssBaseline/>
        <Menu isLightTheme={isLightTheme} changeTheme={changeTheme}>
          <Routes />
        </Menu>
        <MenuBottom />
      </ThemeProvider>
    </Router>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
