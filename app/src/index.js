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
import * as serviceWorker from './sw'
import useRecentRecorder from './hooks/use-recent-recorder'
import api from './api/config'
import 'typeface-roboto'

const App = () => {
  // TODO: uglify data.json
  // TODO: implement offline features
  useRecentRecorder()

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

  // cache imgs other than categories
  ;[
    'announcements',
    'favorites',
    'search',
    'ingredients',
    'recent',
    'us-flag.svg',
    'br-flag.svg',
  ].forEach(name => fetch(
    `${process.env.PUBLIC_URL}/img/${
      name.includes('.') ? name : `${name}.jpg`
    }`
  ))

  return (
    <ThemeProvider theme={isLightTheme ? darkTheme : lightTheme}>
      <CssBaseline/>
      <Menu isLightTheme={isLightTheme} changeTheme={changeTheme}>
        <Routes />
      </Menu>
      <MenuBottom />
    </ThemeProvider>
  )
}

ReactDOM.render(
  <Router basename={`${process.env.PUBLIC_URL}/`}>
    <App />
  </Router>,
  document.getElementById('root')
)

serviceWorker.register()
