import React from 'react'
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'
import red from '@material-ui/core/colors/red'
import lime from '@material-ui/core/colors/lime'

export const lightTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'light',
    primary: indigo,
    secondary: red,
    error: lime,
  },
}))

export const darkTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      dark: indigo['500'],
      main: indigo['900'],
    },
    secondary: {
      dark: red['500'],
      main: red['900'],
    },
    error: {
      dark: lime['500'],
      main: lime['900'],
    },
  },
}))
