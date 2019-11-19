import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
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
    // overflowX: 'auto',
    marginRight: '10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
  // TODO: add an icon to text wrapped options
  // TODO: leave a tip to longpress options to see the entire content
  // TODO: show end of results message when hit the end
  const { text: search } = useParams()
  const theme = useTheme()
  const classes = useStyles(theme)

  // verify if el is overflowing with:
  // const isOverflowing = el.clientWidth < el.scrollWidth ||
  //   el.clientHeight < el.scrollHeight

  const result = query(search)

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
                    <Tooltip title={<SearchResultText result={o} />}>
                      <Chip
                        key={o.key}
                        className={classes.chip}
                        variant="outlined"
                        color="primary"
                        deleteIcon={<FavoriteButton className={classes.npx} />}
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
    </Container>
  )
}
