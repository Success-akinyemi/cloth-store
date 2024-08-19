import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function PrivateRoute() {
    const  {currentUser}  = useSelector(state => state.user)
      return currentUser ? <Outlet /> : <Navigate to='/signin' />
}

function AdminRoute() {
  const  {currentUser}  = useSelector(state => state.user)
  const adminUser = currentUser?.data.isAdmin
    return adminUser ? <Outlet /> : <Navigate to='/' />
}

export {PrivateRoute, AdminRoute}