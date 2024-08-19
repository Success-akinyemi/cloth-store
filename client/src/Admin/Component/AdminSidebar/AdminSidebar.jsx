import { Link, useLocation } from 'react-router-dom'
import './AdminSidebar.css'
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { apiUrl } from '../../../Utils/api';
import { signOut } from '../../../redux/user/userslice';
import { useDispatch } from 'react-redux';

function AdminSidebar({toggleMenu, menuOpen}) {
  const location = useLocation();
  const dispatch = useDispatch()

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
        await fetch(apiUrl('/api/auth/signout'))
        dispatch(signOut())
    } catch (error) {
        console.log(error)
    }
}

  return (
    <div className={`adminMenu ${menuOpen ? 'show' : 'hide'}`}>
        <div className="top">
          <div className="logo">
                <Link className='link'>theLimits Asoke</Link>
          </div>
          <div className="close" onClick={toggleMenu}>
            <CloseIcon className='closeIcon' />
          </div>
        </div>

        <div className="menuList">
          <Link to='/admin-Dashboard' className={`h-2 menuLinks ${isActive('/admin-Dashboard') ? 'active' : ''}`}>
            <DashboardIcon className='menuLinks-icon' />
            <Link to='/admin-Dashboard' className='link menuLink'>Dashboard</Link>
          </Link>

          <Link to='/admin-Orders' className={`h-2 menuLinks ${isActive('/admin-Orders') ? 'active' : ''}`}>
            <AssignmentIcon className='menuLinks-icon' />
            <Link to='/admin-Orders' className='link menuLink'>Orders</Link>
          </Link>

          <Link to='/admin-Products' className={`h-2 menuLinks ${isActive('/admin-Products') ? 'active' : ''} `}>
            <InventoryIcon className='menuLinks-icon' />
            <Link to='/admin-Products' className='link menuLink'>Products</Link>
          </Link>

          <Link to='/admin-Customers' className={`h-2 menuLinks ${isActive('/admin-Customers') ? 'active' : ''}`}>
            <PeopleIcon className='menuLinks-icon' />
            <Link to='/admin-Customers' className='link menuLink'>Customers</Link>
          </Link>

          <Link to='/admin-Settings' className={`h-2 menuLinks ${isActive('/admin-Settings') ? 'active' : ''}`}>
            <SettingsRoundedIcon className='menuLinks-icon' />
            <Link to='/admin-Settings' className='link menuLink'>Settings</Link>
          </Link>

          <Link to='/admin-Category' className={`h-2 menuLinks ${isActive('/admin-Category') ? 'active' : ''}`}>
            <CategoryOutlinedIcon className='menuLinks-icon' />
            <Link to='/admin-Category' className='link menuLink'>
              Category
            </Link>
          </Link>

          <Link to='/admin-NewProduct' className={`h-2 menuLinks ${isActive('/admin-NewProduct') ? 'active' : ''}`}>
            <AddIcon className='menuLinks-icon' />
            <Link to='/admin-NewProduct' className='link menuLink'>
              Add Product
            </Link>
          </Link>
        </div>

        <div className="bottom">
          <span onClick={handleSignOut} className='h-2'><LogoutIcon className='logoutIcon' /> Logout</span>
        </div>
    </div>
  )
}

export default AdminSidebar