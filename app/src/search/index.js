import React from 'react'
import { useParams } from 'react-router-dom'

export default () => {
  // TODO: implement search
  const { text: search } = useParams()
  return (
  	<h1>Looking for "{search}"</h1>
  )
}
