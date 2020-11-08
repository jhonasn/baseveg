import React, { useState } from 'react'
import { Link as Route } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import LaunchIcon from '@material-ui/icons/Launch'
import SelectLanguage from './select-language'
import { routes } from 'routes'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    margin: `${theme.spacing(2)}px 0px`,
  },
  body: {
    marginBottom: theme.spacing(2),
  },
  icon: {
    color: 'white',
    opacity: 0.5,
  },
}))

const content = {
  us: {
    title: 'About the app',
    thisisan: 'This app is an ',
    opensource: 'opensource software',
    createdby: ' created by ',
    alldata: ' All the data contained in this software were made by the ',
    facebook: 'facebook group',
    moderatorsandmembers: ' moderators and members and is open to download in computer format (json), excel or pdf here in ',
    dowloadsection: 'dowload section',
    thanks: 'Many thanks to photographers',
    whomade: 'Who made their photos available to download for free on ',
    unsplash: 'Unsplash website',
    photosincluded: ' Those photos were included in this app in the category backgrounds.',
    photographersreference: ' Photographers reference and photos used:',
    userdeleted: 'User deleted',
  },
  br: {
    title: 'Sobre o aplicativo',
    thisisan: 'Este aplicativo é um ',
    opensource: 'software de código aberto',
    createdby: ' criado por ',
    alldata: ' Todos os dados contidos neste aplicativo foram criados por ',
    facebook: 'grupo do facebook',
    moderatorsandmembers: ' moderadores e membros, e está livre para download em formato para computador (json), excel ou pdf aqui na ',
    dowloadsection: 'sessão de downloads',
    thanks: 'Muito obrigado aos fotógrafos',
    whomade: 'Que disponibilizaram para download gratuito suas fotos no ',
    unsplash: 'site Unsplash',
    photosincluded: ' Estas fotos foram incluidas neste aplicativo principalmente como fundo das categorias.',
    photographersreference: ' Referência dos fotógrafos e fotos utilizadas:',
    userdeleted: 'Usuário deletado',
  },
}

const PICTURES_QUANTITY = 31

let columnsLeft = 0
let imagesLeft = 0
let lastColSize = 0

export default () => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const [language, setLanguage] = useState('br')
  const text = content[language]

  const random = (min, max) => Math.floor((Math.random() * max) + min)
  const getColumnSize = () => {
    let colSize = 0
    // reset images left when restart
    if (imagesLeft === 0) imagesLeft = PICTURES_QUANTITY

    if (columnsLeft === 0) {
      columnsLeft = 3
      while (colSize === lastColSize || !colSize) {
        colSize = random(1, 3)
      }
      lastColSize = colSize
    } else colSize = random(1, columnsLeft)

    if (imagesLeft === 1) colSize = columnsLeft
    else if (!colSize) colSize = 1

    columnsLeft -= colSize
    imagesLeft--
    return colSize
  }

  return (
    <Container>
      <Paper className={classes.root} elevation={1}>
        <SelectLanguage language={language} onSelect={lang => setLanguage(lang)} />
        <Typography variant="h6">{text.title}</Typography>
        <Typography variant="body2" className={classes.body}>
          {text.thisisan}
          <Link href={routes.github} target="_blank">{text.opensource}</Link>
          {text.createdby}
          <Link href="https://facebook.com/jhonasnasc" target="_blank">Jhonas Nascimento</Link>.
          {text.alldata}
          <Link href={routes.facebook} target="_blank">{text.facebook}</Link>
          {text.moderatorsandmembers}
          <Link component={Route} to={routes.download}>{text.dowloadsection}</Link>.
        </Typography>
        <Typography variant="h6">{text.thanks}</Typography>
        <Typography variant="caption">
          {text.whomade}
          <Link href="https://unsplash.com" target="_blank">{text.unsplash}</Link>.
          {text.photosincluded}
          {text.photographersreference}
        </Typography>
      </Paper>

      <GridList cellHeight={160} cols={3} style={{
        width: (window.document.documentElement.clientWidth - 32),
      }}>
        {[
          ['alimentos', 'Joe Holiday', 'yosalov', 'dOZVUW7Bu00'],
          ['balas', 'Vaun0815', 'vaun0815', 'oTaYOGgqvvA'],
          ['biscoitos', 'Mae Mu', 'picoftasty', 'kID9sxbJ3BQ'],
          ['conservas', 'Zeidy Vargas', 'zdyvargas', 'not_found', text.userdeleted],
          ['ervas', 'Lisa Hobbs', 'lisahobbs', 'mRaNok_Ld6s'],
          ['bebidas', 'Kobby Mendez', 'kobbymendez', 'xBFTjrMIC0c'],
          ['material', 'Daiga Ellaby', 'daiga_ellaby', 'uooMllXe6gE'],
          ['higiene', 'Sarah Gualtieri', 'sarahjgualtieri', '9oLEkjtYhCI'],
          ['casa', 'Lucas Gruwez', 'lucasgruwez', 'ofrXUceYv40'],
          ['infantil', 'Piron Guillaume', 'gpiron', 'cRRDzGxqVe8'],
          ['barba', 'Josh Sorenson', 'joshsorenson', 'FvKpUZCbZ-s'],
          ['depilacao', 'Mel Poole', 'melipoole', '3gKTLEjffd4'],
          ['cosmeticos', 'Jazmin Quaynor', 'jazminantoinette', 'FoeIOgztCXo'],
          ['unhas', 'DESIGNECOLOGIST', 'designecologist', 'r-Ej0NQmFlQ'],
          ['tintura', 'Luis Quintero', 'jibarofoto', 'gTOfWL7prYA'],
          ['tatuagem', 'Clem Onojeghuo', 'clemono2', 'WvS0rSIFAJE'],
          ['perfumes', 'Angélica Echeverry', 'angelicaecheverry', '752a7fdivow'],
          ['bolsas', 'Frank Lloyd de la Cruz', 'franklloyd', 'Jp1Ar3H5uLk'],
          ['maquiagem', 'Raphael Lovaski', 'raphaellovaski', 'DEuob2v77wI'],
          ['animais', 'Sam Carter', 'samdc', 'GHOiyov2TSQ'],
          ['aminoacidos', 'Angel Sinigersky', 'sinigersky', 'THdmJFIBEI8'],
          ['ecologicos', 'Laura Mitulla', 'luamtla', 'L8ClxPGHdJE'],
          ['eroticos', 'Gabriel Matula', 'gabriel_matula', 'jpfI1kEyEqg'],
          ['pintura', 'Lucas Benjamin', 'aznbokchoy', 'wQLAGv4_OYs'],
          ['livros', 'Jaredd Craig', 'jaredd_craig', 'HH4WBGNyltc'],
          ['diversos', 'Ashim D’Silva', 'randomlies', 'Kw_zQBAChws'],
          ['favorites', 'Forest Simon', 'forest_ms', 'ZKbve9f7Mp4'],
          ['ingredients', 'Alex Kondratiev', 'alexanderkondratiev', 'yS3XM9qx3hQ'],
          ['announcements', 'Clem Onojeghuo', 'clemono2', 'DoA2duXyzRM'],
          ['search', 'Dan Dimmock', 'dandimmock', 'sNwnjxm8eTY'],
          ['recent', 'Aron Visuals', 'aronvisuals', 'BXOXnQ26B7o'],
        ].map(([categoryId, name, user, hash, obs]) => (
          <GridListTile key={hash} cols={getColumnSize()}>
            <img src={`${process.env.PUBLIC_URL}/img/${categoryId}.jpg`} alt={categoryId} />
            <GridListTileBar
              title={<>
                {name}
                {obs && <Typography variant="caption"> ({obs})</Typography>}
              </>}
              subtitle={
                <Link
                  href={`https://unsplash.com/@${user}`}
                  target="_blank"
                  color="secondary"
                >
                  @{user}
                </Link>
              }
              actionIcon={
                <IconButton
                  className={classes.icon}
                  component={Link}
                  href={`https://unsplash.com/photos/${hash}`}
                  target="_blank"
                >
                  <LaunchIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </Container>
  )
}
