import './MobileNav.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import RestoreIcon from '@mui/icons-material/Restore';
import { Link, useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { useSelector } from 'react-redux';


function MobileNav() {
    const location = useLocation();

    const isActive = (path) => {
      return location.pathname === path;
    };
    const cart = useSelector(state => state.cart)
    
  return (
    <div className='mobileNav'>
        <Link className={`link moblieNavLink ${isActive('/') ? 'active' : ''}`} to='/'>
            <HomeIcon />
            <p>Home</p>
        </Link>
        <Link className={`link moblieNavLink ${isActive('/mycart') ? 'active' : ''}`} to='/mycart'>
            <Badge badgeContent={cart.products?.length} max={99} color='secondary'>
                <ShoppingCartIcon />
            </Badge>
            <p>My cart</p>
        </Link>
        <Link className={`link moblieNavLink ${isActive('/myorder') ? 'active' : ''}`} to='/myorder' >
            <RestoreIcon />
            <p>My Orders</p>
        </Link>
        <Link className={`link moblieNavLink ${isActive('/profile') ? 'active' : ''}`} to='/profile'>
            <AccountCircleIcon />
            <p>Me</p>
        </Link>
    </div>
  )
}

export default MobileNav