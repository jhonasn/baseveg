import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  container: {
    float: 'right',
  },
  flagButton: {
    height: '1.5rem',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&[disabled]': {
      opacity: 0.5,
    },
  },
  brFlag: {
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/br-flag.svg)`,
  },
  usFlag: {
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/us-flag.svg)`,
  },
}))

export default function SelectLanguage({ language, onSelect }) {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <ButtonGroup className={classes.container}>
      <Button
        disabled={language === 'br'}
        className={clsx(classes.flagButton, classes.brFlag)}
        onClick={() => onSelect('br')}
      >
      </Button>
      <Button
        disabled={language === 'us'}
        className={clsx(classes.flagButton, classes.usFlag)}
        onClick={() => onSelect('us')}
      >
      </Button>
    </ButtonGroup>
  )
}
