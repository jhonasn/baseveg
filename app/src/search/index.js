import React from 'react'
import { useParams } from 'react-router-dom'
import { query } from '../api'


const ShowSearchResult = ({ title, items }) => (
  <>
    <h4>{title}:</h4>
    <ul>
      {items.map((i, idx) => (<li key={idx} dangerouslySetInnerHTML={i.name} />))}
    </ul>
  </>
)

export default () => {
  const { text: search } = useParams()
  const { categories, items, options } = query(search)
  return (
    <>
      <ShowSearchResult title="Categorias" items={categories} />
      <ShowSearchResult title="Itens" items={items} />
      <ShowSearchResult title="Opções" items={options} />
    </>)
}
