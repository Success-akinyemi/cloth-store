import { useSelector } from 'react-redux';
import './AdminAside.css'
import MenuIcon from '@mui/icons-material/Menu';
import { recentUpdates } from '../../data/recentUpdates';
import { formatDistanceToNow } from 'date-fns';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; 

function AdminAside({toggleMenu}) {
    const {currentUser} = useSelector(state => state.user)
    const user = currentUser?.data

    const data = recentUpdates
    const sortedStoreData = data.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
    const latestStoreData = sortedStoreData.slice(0, 3);

  return (
    <div className='adminAside'>
        <div className="a-top">
            <div className="menu" onClick={toggleMenu}>
                <MenuIcon className='menuIcon' />
            </div>
            <div className="a-profile">
                <div className="info">
                    <p>Hey, <b className="bold">{user?.username}</b></p>
                    <small className="small text-muted">Admin</small>
                </div>
                <div className="admin-profile">
                    <img className='adminImg' src={user?.profilePicture} alt='profile' />
                </div>
            </div>
        </div>

        <div className="recentUpdates">
            <h2 className="h-2">Recent Updates</h2>
            <div className="updates">
                {
                    latestStoreData?.map((item) => (
                        <div className="update" key={item?._id}>
                            <div className="admin-profile">
                                <NotificationsActiveIcon />
                            </div>
                            <div className="message">
                                <p className="para">
                                    <b className="bold">{item?.name}</b> {' '}
                                    {item?.message}
                                </p>
                                <small className="small text-muted">
                                    {formatDistanceToNow(new Date(item?.createdAt))} Ago.
                                </small>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

        <div className="sales-analytics">
            <h2 className="h-2">Sales Analytics</h2>
            <div className="item online">
                <div className="icon">
                    <span className="cartIcon"><ShoppingCartIcon /></span>
                </div>
                <div className="right">
                    <div className="info">
                        <h3 className="h-3">ONLINE ORDERS</h3>
                        <small className="small text-muted">Last 24 Hours</small>
                    </div>
                    <h5 className="h-5 success">+39%</h5>
                    <h3 className="h3">30000</h3>
                </div>
            </div>

            <div className="item offline">
                <div className="icon">
                    <span className="cartIcon"><LocalShippingIcon /></span>
                </div>
                <div className="right">
                    <div className="info">
                        <h3 className="h-3">DELIVERED ORDERS</h3>
                        <small className="small text-muted">Last 24 Hours</small>
                    </div>
                    <h5 className="h-5 success">+20%</h5>
                    <h3 className="h3">20</h3>
                </div>
            </div>

            <div className="item customers">
                <div className="icon">
                    <span className="cartIcon"><PersonIcon /></span>
                </div>
                <div className="right">
                    <div className="info">
                        <h3 className="h-3">NEW CUSTOMERS</h3>
                        <small className="small text-muted">Last 24 Hours</small>
                    </div>
                    <h5 className="h-5 success">+50%</h5>
                    <h3 className="h3">30</h3>
                </div>
            </div>

            <div className="item add-product">
                <Link to='/admin-NewProduct' className='div'>
                    <span className="cartIcon"><AddIcon /></span>
                    <h3 className='h-3'>Add Product</h3>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default AdminAside