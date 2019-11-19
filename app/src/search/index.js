import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import debounce from 'lodash/debounce'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import MoreIcon from '@material-ui/icons/MoreHoriz';
import Category from '../list/category'
import CardItem from '../list/card-item'
import FavoriteButton from '../favorites/button'
import { query } from '../api'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  chipContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  npx: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  chip: {
    maxWidth: 148,
  },
  chipLabel: {
    marginRight: '10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  infoSnack: {
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    fontSize: 20,
  },
  infoIcon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  infoMessage: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const SearchResultText = ({ result }) => (
  Array.isArray(result.name)
    ? result.name.map((part, idx) => (
      part.bold ? <b key={idx}>{part.content}</b> : part.content
    ))
    : result.name
)

export default () => {
  const { text: search } = useParams()
  const theme = useTheme()
  const classes = useStyles(theme)

  const [showEndOfItems, setShowEndOfItems] = useState(false)
  const [showLongpressInfo, setShowLongpressInfo] = useState(false)
  const [result, setResult] = useState([])

  useEffect(() => {
    // TODO: in future verify if the message was already shown before open it
    setShowLongpressInfo(true)
    if (!result.length) setResult(query(search))
    return () => window.onscroll = null
  }, [])

  useEffect(() => {
    // add overflowing options more icon
    if (result.length) {
      const options = result.reduce((arr, c) => [...arr, ...c.items], [])
        .reduce((arr, i) => i && i.options ? [...arr, ...i.options] : arr, [])

      // already set
      if (options.some(o => o.isOverflowing)) return

      options.forEach(o => {
        const el = document.querySelector(`#option-${o.key}`)
        o.isOverflowing = el.clientWidth < el.scrollWidth ||
          el.clientHeight < el.scrollHeight
      })

      setResult(result)
    }
  }, [result])

  window.onscroll = debounce(() => {
    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight && !showEndOfItems)
        setShowEndOfItems(true)
  }, 100)

  const handleInfoClose = () => setShowLongpressInfo(false)

  return (
    <Container className={classes.root}>
      {result.map(c => (
        <Grid
          key={c.key}
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid item xs={12}>
            <Category
              category={{ ...c, name: <SearchResultText result={c} /> }}
              link={`/items/${c.key}`}
            />
          </Grid>
          {c.items.map(i => (
            <Grid key={i.key} item xs={12}>
              <CardItem
                item={{ ...i, name: <SearchResultText result={i} /> }}
                link={`/options/${i.category}/${i.key}`}
                badge={false}
              >
                <div className={classes.chipContainer}>
                  {i.options.map(o => (
                    <Tooltip key={o.key} title={<SearchResultText result={o} />}>
                      <Chip
                        id={`option-${o.key}`}
                        className={classes.chip}
                        variant="outlined"
                        color="primary"
                        deleteIcon={
                          <>
                            {o.isOverflowing && <MoreIcon />}
                            <FavoriteButton className={classes.npx} />
                          </>
                        }
                        onDelete={() => {}}
                        label={<SearchResultText result={o} />}
                        classes={{ label: classes.chipLabel }}
                      />
                    </Tooltip>
                  ))}
                </div>
              </CardItem>
            </Grid>
          ))}
        </Grid>
      ))}
      <Snackbar
        open={showEndOfItems}
        onClose={() => setShowEndOfItems(false)}
        autoHideDuration={2000}
        TransitionComponent={props => <Slide {...props} direction="up" />}
        message={'Fim dos resultados da busca'}
      />
      <Snackbar
        open={showLongpressInfo}
        onClose={handleInfoClose}
        TransitionComponent={props => <Slide {...props} direction="up" />}
        message={
          <span className={classes.infoMessage}>
            <InfoIcon className={clsx(classes.icon, classes.infoIcon)} />
            Para visualizar todo conteúdo de uma opção (marca),
            basta pressionar e segurar
            <IconButton key="close" color="inherit" onClick={handleInfoClose}>
              <CloseIcon className={classes.icon} />
            </IconButton>
          </span>
        }
        ContentProps={{
          classes: { root: classes.infoSnack }
        }}
      />
    </Container>
  )
}
