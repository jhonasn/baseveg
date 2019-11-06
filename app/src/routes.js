import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Items from './list/items'
import Options from './list/options'
import About from './about'

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
      <Route exact path="/"><Redirect to="/items" /></Route>
      <Route path="/items"><Items /></Route>
      <Route path="/options/:categoryIdx/:itemIdx"><Options /></Route>
      <Route path="/about"><About /></Route>
    </Switch>)
