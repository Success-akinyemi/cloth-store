import { Link } from 'react-router-dom'
import Footer from '../../Component/Footer/Footer'
import MobileNav from '../../Component/MobileNav/MobileNav'
import Navbar from '../../Component/Navbar/Navbar'
import './Cart.css'
import { cartProduct } from '../../data.js/cartProduct'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { checkoutPayment } from '../../Helpers/api'
import { removeFromCart, updateQuantity } from '../../redux/cart/cartSlice'
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';

function Cart() {
    const cart = useSelector(state => state.cart)
    const {currentUser} = useSelector(state => state.user)
    const user = currentUser?.data
    const dispatch = useDispatch();
    const [ loading, setLoading ] = useState(false)
    const [ formData, setFormData ] = useState({})
    console.log('CART',cart)
    console.log('user', user.email)



    const handleQuantity = (type, productId) => {
        const productIndex = cart.products.findIndex((item) => item._id === productId);
    
        if (productIndex !== -1) {
          const currentQuantity = cart.products[productIndex].quantity;
          const newQuantity = type === 'dec' ? Math.max(currentQuantity - 1, 1) : currentQuantity + 1;
    
          // Dispatch the updateQuantity action
          dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemoveFromCart = (idx) => {
        dispatch(removeFromCart(idx))
    }

    const handleCheckout = async () => {
        const email = user.email
        const amount = cart.total
        if(!user.country || !user.state || !user.lga || !user.houseaddress || !user.phonenumber){
            toast.error('Add Shipping Information')
            return;
        }
        if(cart.total <= 0 || cart.products.length === 0){
            toast.error('Cart cannot be empty')
            return;
        }
        setFormData({userId: user._id, products: cart.products, total: cart.total, firstname: user.firstname, lastname: user.lastname, country: user.country, state: user.state, lga: user.lga, houseaddress: user.houseaddress, phonenumber: user.phonenumber, email})
        try {
            setLoading(true)
            const res = await checkoutPayment(formData)
        } catch (error) {
            toast.error('unable to create payment')
            console.log('Checkout', error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='bg cart'>
        <Navbar />
        <MobileNav />
        <div className="content">
            <h1>Your Cart</h1>
            <div className="top">
                <div className="left">
                    <Link to='/store' className='link btn'>Continue Shopping</Link>
                </div>

                <div className="middle">
                    <span>Shopping Item({cart.products?.length})</span>
                </div>

                <div className="right">
                    <button className='btn'>Checkout now</button>
                </div>
            </div>

            <div className="body">
                <div className="left">
                    {
                        cart.products.length <= 0 ? (
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <span><RemoveShoppingCartOutlinedIcon style={{fontSize: '40px'}} /></span>
                                <p style={{fontSize: '20px', fontWeight: '700', marginBottom: '20px'}}>Your Cart is Empty</p>
                                <span><Link to='/store' style={{background: 'purple', color: 'white', padding: '10px'}} className='link'>Continue Shopping</Link></span>
                            </div>
                        ) : (
                            cart.products?.map((item, idx) => (
                                <div key={idx} className="card">
                                    <div className="img">
                                        <img src={item?.img} alt={`${item?.name}`} />
                                    </div>
                                    <div className="info">
                                        <span>Product: <p>{item?.name}</p></span>
                                        <span style={{ fontSize: '14px'}}>ID: <p>{item?._id}</p></span>
                                        <span>Color: 
                                            {
                                                item?.color.map((item, idx) => (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'}}>
                                                        <span style={{background: `${item}`, width: '25px', height: '25px', borderRadius: '50%'}} key={idx} className='colorCircle'>
    
                                                        </span>
                                                        <small style={{cursor: 'pointer'}}>{item}</small>    
                                                    </div>
                                                ))
                                            }
                                        </span>
                                        {item.size.length > 0 ? 
                                            (
                                                <span>Size: 
                                                    {
                                                        item?.size.map((item, idx) => (
                                                            <>
                                                                <span key={idx} className='colorCircle'>{item},</span>
                                                            </>
                                                        ))
                                                    }
    
                                                </span>
                                            ) : ('')
                                        }
                                    </div>
                                    <div className="price">
                                        <div className="quantity">
                                            <p className='title'>Quantity:</p>
                                            <div className='q-card'>
                                                <button onClick={() => handleQuantity('dec', item?._id)} className='qbtn'><RemoveIcon className='icon' /></button>
                                                <span className="number">{item?.quantity}</span>
                                                <button onClick={() => handleQuantity('inc', item?._id)} className='qbtn'><AddIcon className='icon' /></button>
                                            </div>
                                        </div>
                                        <span className="amount">
                                            NGN {item?.price * item?.quantity}
                                        </span>
                                        <button onClick={() => handleRemoveFromCart(idx)} className='removeBtn'>
                                            Remove from cart
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>

                <div className="right">
                    <h1>ORDER SUMMARY</h1>

                    <div className="total">
                        <span>SubTotal: <p>NGN {cart.total.toLocaleString()}</p></span>
                        <span>Shipping fee: <p>NGN 0</p></span>
                        <span>Transaction fee: <p>NGN 0</p></span>
                        <span>Discount: <p>NGN 0</p></span>

                    </div>

                    <div className="total">
                        <h1>Shipping Information</h1>
                        {
                            !user.country || !user.state || !user.lga || !user.houseaddress || !user.phonenumber ? (
                                <div className="updateInfo">
                                    <h2>Add Shipping Information</h2>
                                    <Link to='/profile' className='link updateBtn'>UPADATE HERE</Link>
                                </div>
                            ) : (
                                <>
                                    <span>Country: <p>{user?.country}</p></span>
                                    <span>State: <p>{user?.state}</p></span>
                                    <span>Local Government Area: <p>{user.lga}</p></span>
                                    <span>House Address: <p>{user.houseaddress}</p></span>
                                    <span>Phone Number: <p>{user.phonenumber}</p></span>

                                    <div className="updateInfo">
                                        <h2>Upadate Shipping Information?</h2>
                                        <Link to='/profile' className='link updateBtn'>UPADATE HERE</Link>
                                    </div>
                                </>
                            )
                        }
                    </div>

                    <div className="totalfee">
                        <span>Total: <p>NGN {cart.total.toLocaleString()}</p></span>
                    </div>

                    <button onClick={handleCheckout} className='checkoutBtn'>{loading ? 'Procesing...' : 'Checkout now'}</button>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default Cart