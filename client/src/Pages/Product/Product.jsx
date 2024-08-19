import { useLocation } from 'react-router-dom'
import Footer from '../../Component/Footer/Footer'
import MobileNav from '../../Component/MobileNav/MobileNav'
import Navbar from '../../Component/Navbar/Navbar'
import './Product.css'
import { product } from '../../data.js/product'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useFetchProduct } from '../../Helpers/fetch.hooks'
import Spinner from '../../Admin/Component/Spinner/Spinner'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { addProduct } from '../../redux/cart/cartSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

function Product() {
    const loc = useLocation()
    const path = loc.pathname.split('/')[3]
    const { isLoadingProduct, productData  } = useFetchProduct(path);
    const data = productData?.data
    const [ productquantity, setProductQuantity ] = useState(1)
    const [ productColor, setProductColor ] = useState([])
    const [ productSize, setProductSize ] = useState([])
    const dispatch = useDispatch()


    const handleQuantity = (type) => {
        if(type === 'dec'){
            productquantity > 1 && setProductQuantity(productquantity - 1)
        } else{
            setProductQuantity(productquantity + 1)
        }
    }

    const handleColorChange = (item) => {
        const productItem = item

        setProductColor((prevColor) => {
            if (!prevColor.includes(productItem)) {
                return [...prevColor, productItem];
            }
            return prevColor;
        });
    }

    const handleSizeChange = (e) => {
        const productSize = e.target.value

        setProductSize((prevSize) => {
            if (!prevSize.includes(productSize)) {
                return [...prevSize, productSize];
            }
            return prevSize;
        });
    }

    const handleRemoveSize = (item) => {
        const index = productSize.indexOf(item);

        if (index !== -1) {
            const newSize = [...productSize];
            newSize.splice(index, 1);
            setProductSize(newSize);
        }
    }

    const handleRemoveColor = (item) => {
        const index = productColor.indexOf(item);

        if (index !== -1) {
            const newColor = [...productColor];
            newColor.splice(index, 1);
            setProductColor(newColor);
        }
    }

    const handleAddToCart = () => {
        if(productColor.length === 0){
            toast.error('Please select a color')
            return;
        }
        if (data.size && data.size.length > 0 && productSize.length === 0) {
            toast.error('Please select product size');
            return;
        }
        dispatch(
            addProduct({ ...data, price: data?.isDiscountAllowed ? data?.discountPrice : data?.price,  quantity: productquantity, color: productColor, size: productSize })
        )
        toast.success('Item addded to cart')
    }

    
    if(isLoadingProduct){
        return <div className="loadingContainer">
            <Spinner />
        </div>
    }
    const formattedPrice = data?.isDiscountAllowed ? data?.discountPrice.toLocaleString() : data?.price.toLocaleString() ;


  return (
    <div className='bg product'>
        <Navbar />
        <MobileNav />

        <div className="content">
            <div className="left">
                <img src={data?.img} alt={`${data?.name}`} className="productImg" />
            </div>

            <div className="right">
                <h1 className='productName'>{data?.name}</h1>
                <p className="productDesc">{data?.desc}</p>
                <p className="productPrice">{
                    data?.isDiscountAllowed ? (
                        <div className='discountBox'>
                            <p className='discountPrice' >NGN {formattedPrice}</p>
                            <p className='originalPrice'><small>Orignal Price</small> NGN {data?.price.toLocaleString()}</p>
                        </div>
                    ) : (
                        <p>NGN {formattedPrice}</p>
                    )
                }</p>
                <div className="colors">
                    <p className="productColors">Select from Available colors:</p>
                    <div className="colorPlate">
                        {
                            data?.color.map((item, idx) => (
                                <>
                                    <span onClick={() => handleColorChange(item)} style={{background: `${item}`}} key={idx} className='colorCircle'>

                                    </span>
                                    <small onClick={() => handleColorChange(item)} style={{cursor: 'pointer'}}>{item}</small>    
                                </>
                            ))
                        }
                    </div>
                    <div className="selectedSize">
                        {
                            productColor.length > 0 && (
                                <>
                                <h2 className="h-2">Selected Color(s)</h2>
                                <div className="items">
                                {
                                    productColor.map((item, idx) => (
                                        <span key={idx} className='selectedSizeItem'>                   
                                            {item}
                                            <div className="close" onClick={() => handleRemoveColor(item)}>
                                                <CloseIcon className='closeIcon' />
                                            </div>
                                        </span>
                                    ))
                                }
                                </div>
                                </>
                            )
                        }
                    </div>
                </div>
                {
                    data?.size.length > 0  ? (
                        <div className="size">
                            <div className="productSize">Available size:</div>
                            <select className='productSelect' onClick={(e) => handleSizeChange(e)}>
                                <option disabled className='productOption'>-- select size --</option>
                                {
                                    data?.size.map((item, idx) => (
                                        <option className='productOption' value={item} key={idx}>{item}</option>
                                    ))
                                }
                            </select>
                        </div>
                    ) : ( null )
                }
                    <div className="selectedSize">
                        {
                            productSize.length > 0 && (
                                <>
                                <h2 className="h-2">Selected Sizes</h2>
                                <div className="items">
                                {
                                    productSize.map((item, idx) => (
                                        <span key={idx} className='selectedSizeItem'>                               
                                            {item}
                                            <div className="close" onClick={() => handleRemoveSize(item)}>
                                                <CloseIcon className='closeIcon' />
                                            </div>
                                        </span>
                                    ))
                                }
                                </div>
                                </>
                            )
                        }
                    </div>
                <p className={`instock ${data?.quantity <= 0 ? 'yellow' : 'green'} `}>{data?.quantity <= 0 ? 'Out of Stock' : 'Available in Stock'}</p>
                <div className="quantity">
                    <p className='title'>Quantity:</p>
                    <div className='q-card'>
                        <button onClick={() => handleQuantity('dec')} className='qbtn'><RemoveIcon className='icon' /></button>
                        <span className="number">{productquantity}</span>
                        <button onClick={() => handleQuantity('inc')} className='qbtn'><AddIcon className='icon' /></button>
                    </div>
                </div>

                <div className="btn">
                    <button onClick={handleAddToCart}>Add to cart <ShoppingCartIcon className='icon' /></button>
                </div>
            </div>
        </div>

        <Footer />
    </div>
  )
}

export default Product