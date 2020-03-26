import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Categories from './list/categories'
import Items from './list/items'
import Options from './list/options'
import Recent from './recent'
import Favorites from './favorites'
import Announcements from './announcements'
import Ingredients from './ingredients'
import Download from './download'
import About from './about'
import Search from './search'

export const routes = ({
  categories: '/categories',
  items: '/items/:categoryId',
  options: '/options/:categoryId/:itemId',
  recent: '/recent',
  favorites: '/favorites',
  announcements: '/announcements',
  ingredients: '/ingredients',
  download: '/download',
  about: '/about',
  search: '/search/:text',
  facebook: 'https://www.facebook.com/groups/trollajuda/',
  github: 'https://github.com/jhonasn/vegajuda',
})

export default () => (
  <Switch>
    <Route exact path="/" component={Categories} />
    <Route path={routes.categories} component={Categories} />
    <Route path={routes.items} component={Items} />
    <Route path={routes.options} component={Options} />
    <Route path={routes.recent} component={Recent} />
    <Route path={routes.favorites} component={Favorites} />
    <Route path={routes.announcements} component={Announcements} />
    <Route path={routes.ingredients} component={Ingredients} />
    <Route path={routes.download} component={Download} />
    <Route path={routes.about} component={About} />
    <Route path={routes.search} component={Search} />
    <Redirect to="/" />
  </Switch>
)
