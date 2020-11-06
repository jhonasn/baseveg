import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import lightBlue from '@material-ui/core/colors/lightBlue'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'

// TODO: finish save the theme selected
export const lightTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'light',
    primary: { ...lightBlue, main: '#0077cb' }, // lightBlue
    secondary: { ...green, main: '#00af42' }, // green
    error: red, // white #ffffff
  },
}))

export const darkTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      dark: lightBlue['500'],
      main: lightBlue['900'],
    },
    secondary: {
      dark: green['500'],
      main: green['900'],
    },
    error: {
      dark: red['500'],
      main: red['900'],
    },
  },
}))
