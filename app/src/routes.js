import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Items from './list/items'
import Options from './list/options'
import Recent from './recent'
import Favorites from './favorites'
import Announcements from './announcements'
import Download from './download'
import About from './about'
import Search from './search'

export const routes = ({
  items: '/items',
  options: '/options/:categoryIdx/:itemIdx',
  recent: '/recent',
  favorites: '/favorites',
  announcements: '/announcements',
  download: '/download',
  about: '/about',
  search: '/search/:text',
  facebook: 'https://www.facebook.com/groups/trollajuda/',
  github: 'https://github.com/jhonasn/vegajuda',
})

export default () => (
    <Switch>
      <Route exact path="/"><Redirect to={routes.items} /></Route>
      <Route path={routes.items}><Items /></Route>
      <Route path={routes.options}><Options /></Route>
      <Route path={routes.recent}><Recent /></Route>
      <Route path={routes.favorites}><Favorites /></Route>
      <Route path={routes.announcements}><Announcements /></Route>
      <Route path={routes.download}><Download /></Route>
      <Route path={routes.about}><About /></Route>
      <Route path={routes.search}><Search /></Route>
    </Switch>)
