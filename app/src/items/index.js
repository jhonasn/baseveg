import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  category: {
    padding: theme.spacing(3, 2),
  },
}))

export default () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [data, setData] = useState({})
  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.PUBLIC_URL}/data.json`)
      const data = await res.json()
      // TODO: Implement render more when scroll hit the end of screen
      const categories = data.categories.slice(0, 1)
      categories[0].items = categories[0].items.slice(0, 20)
      setData({ ...data, categories })
    })()
  }, [data.length])
  const { categories } = data
  return (
    <Container fixed>
      <Typography variant="h5" gutterBottom>
        Lista de produtos liberados do grupo Vegajuda - Veganismo
      </Typography>
      <Divider />
      {categories && categories.length &&
      data.categories.map(c => (
        <>
        <Paper key={c.name} className={classes.category}>
          <Typography variant="subtitle1" gutterBottom>{c.name}</Typography>
        </Paper>
        {c.items.map((i, iidx) => (
          <ExpansionPanel key={iidx}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${iidx}-content`}
              id={`panel-${iidx}-header`}
            >
              <Typography className={classes.heading}>
                <Typography variant="subtitle2" gutterBottom>{i.name}</Typography>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {i.options.map((o, oidx) => (
                <Card className={classes.card} key={oidx}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>{o.name}</Typography>

                    {o.observations && <>
                      <Typography variant="body2" variant="strong">Obs:</Typography>
                      <Typography variant="body2" variant="p" gutterBottom>{o.observations}</Typography>
                    </>}

                    {o.warnings && <>
                      <Typography variant="body2" variant="strong">Atenção:</Typography>
                      <Typography variant="body2" variant="p" gutterBottom>{o.warnings}</Typography>
                    </>}

                    {o.only && <>
                      <Typography variant="body2" variant="strong">Somente:</Typography>
                      <Typography variant="body2" variant="p" gutterBottom>{o.only}</Typography>
                    </>}

                    {o.except && <>
                      <Typography variant="body2" variant="strong">Exceto:</Typography>
                      <Typography variant="body2" variant="p" gutterBottom>{o.except}</Typography>
                    </>}
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
        </>
      ))}
    </Container>
  )
}
