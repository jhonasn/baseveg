import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Categories from './routes/list/categories'
import Items from './routes/list/items'
import Options from './routes/list/options'
import Recent from './routes/recent'
import Favorites from './routes/favorites'
import Announcements from './routes/announcements'
import Ingredients from './routes/ingredients'
import Download from './routes/download'
import About from './routes/about'
import Search from './routes/search'

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
  facebookPage: 'https://www.facebook.com/VegAjuda/',
  github: 'https://github.com/jhonasn/baseveg',
})

export default () => (
  <Switch>
    <Redirect exact from="/" to={routes.categories} />
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
    <Redirect to={routes.categories} />
  </Switch>
)
