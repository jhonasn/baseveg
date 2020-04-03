import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import WarningIcon from '@material-ui/icons/Warning'
import Banner from '../components/banner'
import { routes } from '../routes'

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
  },
  help: {
    fontWeight: 900,
    marginTop: theme.spacing(2),
  },
}))

export default () => {
  // TODO: use card with image to display title instead colored title
  const theme = useTheme()
  const classes = useStyles(theme)

  const content = [
    `Verifique sempre os ingredientes/composição dos produtos
    antes de comprá-los.`,
    `Muitas empresas mudam as fórmulas ao longo do tempo incluindo
    ou retirando ingredientes de origem animal.`,
    `Os produtos e empresas foram incluídos na lista após contato prévio
    com os SACs e sempre de acordo com as informações fornecidas pelas próprias
    empresas, mas, como bem sabemos, as informações mudam.`,
    `As empresas podem ser compradas e se associar a outras empresas que
    realizam testes em animais, passar a patrocinar eventos que usem animais ou
    mudar os ingredientes dos produtos e isso nem sempre fica claro quando
    entramos em contato com os SACs.`,
    [
      `Se souber de informações contrárias a alguma empresa
      ou produto presente na lista, avise os administradores
      do `,
      <Link href={routes.facebook} target="_blank">
        VegAjuda - Veganismo
      </Link>,
      ` para que a lista seja editada.`
    ],
    [
      `A lista é colaborativa! Não viu a marca que procura na lista? Entre
      também em contato com as empresas e envie as respostas dos SACs para os
      administradores do grupo `,
      <Link href={routes.facebook} target="_blank">
        VegAjuda - Veganismo no grupo
      </Link>,
      ' ou ',
      <Link href={routes.facebookPage} target="_blank">
        na página no Facebook
      </Link>,
      '.'
    ],
  ]

  return (
    <>
      <Banner
        title="Avisos"
        subtitle="Atenção a essas dicas:"
        imgName="announcements"
        isFullWidth
      />
      <Container className={classes.container}>
        <Paper className={classes.paper}>
          {content.map(p =>
            <Typography variant="body1" gutterBottom>
              {typeof p === 'string' && p}
              {Array.isArray(p) && p.map(pp => pp)}
            </Typography>
          )}
          <Typography
            variant="subtitle1"
            color="primary"
            className={classes.help}
          >
            Contamos com a ajuda de todos para que a lista cresça
            e melhore cada vez mais!
          </Typography>
        </Paper>
      </Container>
    </>
  )
}
