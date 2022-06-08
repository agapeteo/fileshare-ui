/* eslint-disable */

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilFile,
} from '@coreui/icons'
import {  CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'files',
  },
  {
    component: CNavItem,
    name: 'My Files',
    to: '/my-files',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
]

export default _nav
