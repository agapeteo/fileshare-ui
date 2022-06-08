import React from 'react'

const MyFiles = React.lazy(() => import('./views/files/MyFiles'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/my-files', name: 'MyFiles', element: MyFiles },
]

export default routes
