import React from 'react'
import { Link } from 'react-router-dom'
import LinkMUI from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import RunIcon from '@material-ui/icons/DirectionsRun'
import BuildIcon from '@material-ui/icons/Build'
import { routes } from '../routes'

export default () => {
  // TODO: implement download
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        <DownloadIcon />
        Baixar
        <DownloadIcon />
      </Typography>
      <Typography variant="body2" gutterBottom>
        Disponibilizará download dos arquivos de dados do aplicativo nos
        formatos pdf, excel e json, fazendo jus ao que está escrito em&nbsp;
        <LinkMUI component={Link} to={routes.about}>sobre</LinkMUI>.
      </Typography>
      <Typography variant="body1" align="center">
        <BuildIcon />
        Em construção
        <RunIcon />
      </Typography>
    </Container>
  )
}
