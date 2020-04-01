import React from 'react'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  notFountPaper: {
    padding: theme.spacing(2),
  },
  brandsDescription: {
    display: 'block',
  },
  chipContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  chip: {
    maxWidth: 148,
    marginLeft: 2,
    marginBottom: 2,
  },
}))

export function ChipContainer ({ children }) {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <div className={classes.chipContainer}>{children}</div>
  )
}

export default function Chiptip({
  children,
  tip,
  icon = <></>,
  maxWidth,
  onClick,
}) {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Tooltip
      title={tip || children}
    >
      <Chip
        className={classes.chip}
        variant="outlined"
        color="primary"
        deleteIcon={icon}
        onDelete={onClick || (() => {})}
        label={children}
        classes={{ label: classes.chipLabel }}
        clickable
        style={{ maxWidth }}
      />
    </Tooltip>)
}
