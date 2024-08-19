import { useSelector } from 'react-redux'
import Footer from '../../Component/Footer/Footer'
import MobileNav from '../../Component/MobileNav/MobileNav'
import Navbar from '../../Component/Navbar/Navbar'
import { useFetchOrder } from '../../Helpers/fetch.hooks'
import './Orders.css'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../../Admin/Component/Spinner/Spinner'
import { useNavigate } from 'react-router-dom'

function Orders() {
    const navigate = useNavigate()
    const {currentUser} = useSelector(state => state.user)
    const user = currentUser?.data
    const { isLoadingOrder, orderData, orderError } = useFetchOrder(user._id)
    const data = orderData?.data

    const sortedData = data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if(orderError){
        navigate('/signin')
    }
  return (
    <div className='bg orders'>
        <Navbar />
        <MobileNav />
        <div className="content">
            <h1>Your Orders</h1>

            <div className="container">
                {
                    isLoadingOrder ? (
                        <Spinner />
                    ) : (
                        sortedData?.length <= 0 ? (
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <span><LocalShippingIcon style={{fontSize: '40px'}} /></span>
                                <p style={{fontSize: '20px', fontWeight: '700', marginBottom: '20px'}}>Your Cart is Empty</p>
                                <span><Link to='/store' style={{background: 'purple', color: 'white', padding: '10px'}} className='link'>Continue Shopping</Link></span>
                            </div>
                        ) : (
                            sortedData?.map((item) => (
                                <div key={item?._id} className="card">
                                    <small>Order ID: {item?._id}</small>
                                    <div className="top">
                                        <div className="info">
                                            <span>ORDER PLACED: {formatDistanceToNow(new Date(item?.createdAt))} ago</span>
                                            <span>DELIVERY STATUS: <p className={`payment ${item?.status === 'Pending' ? 'pending' : 'delivered'}`}>{item?.status}</p> </span>
                                        </div>
                                        <div className="info">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px'}}>Payment: <p style={{fontWeight: '700px'}} className={`${item?.payment ? 'delivered' : 'pending'}`}>{item?.payment ? 'Paid' : 'Not Paid'}</p></span>
                                            <span style={{fontWeight: '700px'}}>Total: {item?.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {
                                        item?.products.map((p, idx) => (
                                            <div key={idx} className="middle">
                                                <div className="img">
                                                    <img src={p?.img} alt='product' />
                                                </div>
                                                <div className="productInfo">
                                                    <span>NAME: {p.name}</span>
                                                    <span>QUANTITY: {p?.quantity}</span>
                                                    { p?.size.length > 0 && <span>SIZE: {p?.size.map((s) => (<>{s},</>))}</span>}
                                                    <span>COLOR: {p?.color}</span>
                                                    <span>UNIT PRICE: {p?.price}</span>
                                                    <span>TOTAL PRICE: {p?.price*p?.quantity}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div className="bottom">
                                        <h3 style={{fontWeight: '600'}}>Delivery Information:</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                                            <span>Customer Name: {item?.firstname} {item?.lastname}</span>
                                            <span>Country: {item?.country}</span>
                                            <span>State: {item?.state}</span>
                                            <span>House Address: {item?.houseaddress}</span>
                                            <span>Phone Number: {item?.phonenumber}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )
                }
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default Orders