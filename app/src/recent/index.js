import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import HistoryIcon from '@material-ui/icons/History'
import RunIcon from '@material-ui/icons/DirectionsRun'
import BuildIcon from '@material-ui/icons/Build'

export default () => {
  // TODO: implement recent
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        <HistoryIcon />
        Recentes
        <HistoryIcon />
      </Typography>
      <Typography variant="body2" gutterBottom>
        Mostrará o histórico das ultimas buscas, categorias,
        items <small>(produtos)</small> visitados.
      </Typography>
      <Typography variant="body1" align="center">
        <BuildIcon />
        Em construção
        <RunIcon />
      </Typography>
    </Container>
  )
}
