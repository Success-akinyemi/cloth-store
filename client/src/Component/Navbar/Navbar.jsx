import { useSelector } from 'react-redux'
import './Navbar.css'
import { useEffect, useState } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

function Navbar() {
    const {currentUser} = useSelector(state => state.user)
    const user = currentUser?.data
    const cart = useSelector(state => state.cart)

    const [greeting, setGreeting] = useState('')

    //Greetings
    useEffect(() => {
        const today =  new Date();
        const currentHour = today.getHours();
  
        let newGreeting = '';
        if(currentHour >= 5 && currentHour > 12){
            newGreeting = 'Good Morning'
        } else if( currentHour >= 12 && currentHour < 18){
            newGreeting = 'Good Afternoon'
        } else {
            newGreeting = 'Good Evening'
        }
  
        setGreeting(newGreeting)
    }, [])

  return (
    <div className='bg navbar'>
        <div className="left">
            <div className="logo">
                <Link to='/' className='link'>theLimits Asoke</Link>
            </div>
            {
                user ? (
                    <div className='username'>
                        <p className='p-1'>Hi, <span>{user?.username}</span></p>
                        <p className='p-2'>Lets go shopping</p>
                    </div>
                ) : (
                    <div className='username'>
                        <p className='p-1'>Hi, <span>{greeting}</span></p>
                        <p className='p-2'>Lets go shopping</p>
                    </div>
                )
            }
        </div>

        <div className="right">
            <div className="navprofile">
                {
                    user ? (
                        <img className='profileImg' src={user?.profilePicture} alt="profile" />
                    ) :
                    (
                        <AccountCircleIcon className='profileImg'  />
                    )
                }
            </div>
            <div className='isUser'>
                {
                    user ? <Link className='link' to='/profile'>My Profle</Link> : <Link className='link' to='/signin'>Signin</Link>
                }
                <Link to='/mycart' className='link'>
                    <Badge badgeContent={cart.products?.length} max={99} color='secondary'>
                        <ShoppingCartIcon />
                    </Badge>
                </Link>
            </div>
            {
                user?.isAdmin && (
                    <Link className='link adminLink' to='/adminLogin' >
                        <AdminPanelSettingsOutlinedIcon />
                        Admin
                    </Link>
                )
            }
        </div>
    </div>
  )
}

export default Navbar