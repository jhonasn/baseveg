import React, { useState, useEffect, useCallback } from 'react'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CategoryIcon from '@material-ui/icons/Category'
import ItemIcon from '@material-ui/icons/ShoppingCart'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import Loading from '../components/loading'
import MessagePaper from '../components/message-paper'
import Banner from '../components/banner'
import api from '../api/recent'

export default () => {
  const [recents, setRecents] = useState(null)

  const reload = useCallback(
    async () => setRecents(await api.load()),
    [setRecents]
  )

  useEffect(() => {
    reload()
  }, [reload])

  const handleRemove = async id => {
    const removed = await api.remove(id)
    if (removed) reload()
  }

  const handleClear = async () => {
    await api.clear()
    reload()
  }

  if (!recents) return <Loading />

  return (
    <>
      <Banner
        title="Recentes"
        subtitle={
          !!recents && !!recents.length &&
          `${recents.length} itens visitados`
        }
        imgName="recent"
        isFullWidth
        options={(
          <Button color="inherit" onClick={handleClear} style={{ float: 'right' }}>
            Limpar histórico
          </Button>
        )}
      />
      <Container>
        <MessagePaper
          message={!recents.length && "Nenhum foi item recentemente visitado"}
          hasMarginTop
        >
          <List dense>
            {recents.map(i => (
              <ListItem key={i.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    {({
                      'category': <CategoryIcon />,
                      'item': <ItemIcon />,
                      'search': <SearchIcon />,
                    })[i.type]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={i.name} secondary={i.date.toLocaleString()} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleRemove(i.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </MessagePaper>
      </Container>
    </>
  )
}
