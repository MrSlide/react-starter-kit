import React from 'react'
import { NavLink } from 'react-router-dom'
import type { ReactElement } from 'react'

export default function Nav (): ReactElement {
  return (
    <nav>
      <NavLink to='/a'>A</NavLink>
      <NavLink to='/b'>B</NavLink>
    </nav>
  )
}
