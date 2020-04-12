import React, { useState, useEffect, useCallback, useRef } from 'react'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { makeStyles, fade } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import { routes } from '../routes'

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(5),
    marginTop: 1,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchIcon: {
    width: theme.spacing(4),
    padding: 0,
    top: 0,
    right: 0,
    pointerEvents: 'all',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 0, 1, 5),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  inputEl: {
    paddingRight: theme.spacing(1),
  },
  inputWithClearBtn: {
    paddingRight: theme.spacing(4),
  },
}))

export default function SearchField() {
  const [showClear, setShowClear] = useState(false)

  const history = useHistory()
  const classes = useStyles()
  const searchField = useRef(null)
  const clearButton = useRef(null)

  const currentUrl = history.location.pathname

  const getInput = () => searchField.current.firstElementChild

  const getSearchText = useCallback(() =>
    currentUrl.replace('/search/', ''),
  [currentUrl])

  const handleFocus = e => setShowClear(true)

  const handleBlur = e => e.relatedTarget !== clearButton.current &&
    setShowClear(false)

  const handleClear = e => {
    const el = getInput()
    el.value = ''
    el.focus()
  }

  const handleSubmit = e => {
    e.preventDefault()
    const el = getInput()
    history.push(routes.search.replace(':text', el.value))
    el.blur()
  }

  useEffect(() => {
    const isInSeachRoute = currentUrl.includes('/search/')
    const searchText = getSearchText()
    const el = getInput()

    if (!isInSeachRoute) el.value = ''
    else if (searchText && el.value !== searchText)
      el.value = searchText
  }, [currentUrl, getSearchText])

  return (
    <form className={classes.search} onSubmit={handleSubmit}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Buscar..."
        name="search"
        ref={searchField}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        className={clsx(classes.inputEl, {
          [classes.inputWithClearBtn]: showClear,
        })}
        onFocus={handleFocus}
        onBlur={handleBlur}
        inputProps={{ 'aria-label': 'search' }}
        autoComplete="off"
      />
      {showClear &&
        <IconButton
          className={clsx(classes.searchIcon, classes.clearSearchIcon)}
          onClick={handleClear}
          ref={clearButton}
          color="inherit"
        >
          <ClearIcon />
        </IconButton>
      }
    </form>
  )
}
