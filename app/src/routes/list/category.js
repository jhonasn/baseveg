import React from 'react'
import CategoryIcon from '@material-ui/icons/Category'
import Banner from 'components/banner'

export default ({ data: c, isBanner }) => (
  <Banner
    title={c.name}
    imgName={c.id}
    link={!isBanner && `/items/${c.id}`}
    type={<><CategoryIcon style={{ fontSize: 'inherit' }} /> Categoria</>}
    isFullWidth={isBanner}
  />
)
