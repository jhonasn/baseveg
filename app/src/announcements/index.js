import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import WarningIcon from '@material-ui/icons/Warning'
import { routes } from '../routes'

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
  },
  title: {
    textAlign: 'center',
  },
}))

export default () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const content = [
    `Verifique sempre os ingredientes/composição dos
    produtos antes de comprá-los. Muitas empresas
    mudam as fórmulas ao longo do tempo incluindo ou
    retirando ingredientes de origem animal.`,
    `Os produtos e empresas foram incluídos na lista após
    contato prévio com os SACs e sempre de acordo com
    as informações fornecidas pelas próprias empresas.`,
    `Mas, como bem sabemos, as informações mudam. As
    empresas podem ser compradas e se associar a outras
    empresas que realizam testes em animais, passar a
    patrocinar eventos que usem animais ou mudar os
    ingredientes dos produtos e isso nem sempre fica
    claro quando entramos em contato com os SACs.`,
    [
      `Se souber de informações contrárias a alguma empresa
      ou produto presente na lista, avise os administradores
      do `,
      <Link href={routes.facebook} target="_blank">
        VegAjuda - Veganismo
      </Link>,
      ` para que a lista seja editada.`
    ],
    `Entre também em contato com as empresas e envie as
    respostas dos SACs para os administradores do grupo.`,
  ]

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Typography className={classes.title} gutterBottom>
          <Typography variant="h5" color="error" component="span">
            <WarningIcon color="secondary" /> Atenção!&nbsp;
          </Typography>
          <Typography variant="h5" color="primary" component="span">
            Importante! <WarningIcon color="secondary" />
          </Typography>
        </Typography>
        {content.map(p =>
          <Typography variant="body1" gutterBottom>
            {typeof p === 'string' && p}
            {Array.isArray(p) && p.map(pp => pp)}
          </Typography>
        )}
        <Typography variant="body1" color="secondary">
          Contamos com a ajuda de todos para que a lista cresça
          e melhore cada vez mais!
        </Typography>
      </Paper>
    </Container>
  )
}
