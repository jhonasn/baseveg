import React from 'react'
import Banner from '../components/banner'

export default ({ data: c, isBanner }) => {
  // const type = c && i
  //   ? <>Produto <small>(item)</small></>
  //   : 'Categoria'
  //
  //   <Banner
  //     title={!i ? c.name : i.name}
  //     subtitle={i && c.name}
  //     imgName={c.id}
  //     link={link}
  //     type={type}
  //     isFullWidth={isBanner}
  //     favoriteOptions={i && { type: 'item', i.id }}
  //   />

  return (
    <Banner
      title={c.name}
      imgName={c.id}
      link={!isBanner && `/items/${c.id}`}
      type={'Categoria'}
      isFullWidth={isBanner}
    />
  )
}
