import React from 'react'
import { useParams } from 'react-router-dom'
import { query } from '../api'


const SearchResultText = ({ result }) => Array.isArray(result.name)
  ? result.name.map(part => (
      part.bold ? <b>{part.content}</b> : part.content
    ))
  : result.name

export default () => {
  const { text: search } = useParams()
  const result = query(search)
  return (
    result.map(c => (
      <React.Fragment key={c.key}>
        <p><SearchResultText result={c} /></p>
        <ul>
          {c.items.map(i => (
            <li key={i.key}>
              <p><SearchResultText result={i} /></p>
              <ul>
              {i.options.map(o => (
                  <li key={o.key}><SearchResultText result={o} /></li>
              ))}
              </ul>
            </li>
          ))}
        </ul>
      </React.Fragment>
    ))
  )
}
