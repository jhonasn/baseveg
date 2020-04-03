import React from 'react'
import Banner from '../components/banner'

export default ({ data: c, isBanner }) => (
  <Banner
    title={c.name}
    imgName={c.id}
    link={!isBanner && `/items/${c.id}`}
    type={'Categoria'}
    isFullWidth={isBanner}
  />
)

