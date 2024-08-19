import { useDispatch, useSelector } from 'react-redux'
import './Profile.css'
import { useState } from 'react'
import AccountProfile from '../../Component/AccountProfile/AccountProfile'
import UserTransactions from '../../Component/UserTransactions/UserTransactions'
import { apiUrl } from '../../Utils/api'
import { signOut } from '../../redux/user/userslice'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom'

function Profile() {
  const { currentUser } = useSelector(state => state.user)
  const user = currentUser?.data
  const dispatch = useDispatch()
  const [ menuOption, setMenuOption ] = useState('accountProfile')
  const [ toggleSidebar, setToggleSidebar ] = useState(false) 

  const handleSignOut = async () => {
    try {
        await fetch(apiUrl('/api/auth/signout'))
        dispatch(signOut())
    } catch (error) {
        console.log(error)
    }
  }

  const RenderMenuOption = () => {
    switch(menuOption){
      case 'accountProfile':
        return <AccountProfile />;
      case 'transactions':
        return <UserTransactions />;

      default:
        return ''
    }
  } 

  const toggle = () => {
    setToggleSidebar((prev)=>!prev)
  }

  {console.log(toggleSidebar)}
  return (
    <div className='profile'>
      <div className={`sidebar ${toggleSidebar ? 'show' : 'hide' }`}>
        <div className="close" onClick={toggle}>
            <CloseIcon className='closeIcon' />
        </div>
          <div className="top">
              <img className='profileImg' src={user.profilePicture} alt={`profile image of ${user.username}`} />
              <h2 className='username'>{user.username}</h2>
          </div>

          <div className="menu">
            <span onClick={() => setMenuOption('accountProfile')} className={`links ${ menuOption === 'accountProfile' ? 'activeLink' : ''}`} >My Account</span>
            <span onClick={() => setMenuOption('transactions')} className={`links ${ menuOption === 'transactions' ? 'activeLink' : ''}`} >My Transactions</span>
            <span onClick={() => setMenuOption('')} className={`links ${ menuOption === '' ? 'activeLink' : ''}`} ></span>
            <span onClick={() => setMenuOption('')} className={`links ${ menuOption === '' ? 'activeLink' : ''}`} ></span>
          </div>

          <div onClick={handleSignOut} className="logout">
            Logout
          </div>
      </div>

      <div className="content">
        <div className="menuCard" onClick={toggle}>
            <MenuIcon className='menuIcon' />
        </div>
        <div className="home">
          <Link to='/' className='link'>
            <HomeIcon className='homeIcon' />
          </Link>
        </div>
        {RenderMenuOption()}
      </div>
    </div>
  )
}

export default Profile