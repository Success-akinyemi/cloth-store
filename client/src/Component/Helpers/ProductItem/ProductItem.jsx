import { Link } from 'react-router-dom';
import './ProductItem.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined'

function ProductItem({data}) {

    const formattedPrice = data?.isDiscountAllowed ? data?.discountPrice?.toLocaleString() : data?.price?.toLocaleString();

  return (
    <div className='productItem' key={data?._id}>
        <Link className='link productLink' to={`/store/product/${data?._id}`}>
            <img className='img' src={`${data?.img}`} alt={`${data?.name}`} />
        </Link>
        <div className='info'>
            <div className="top">{data?.name}</div>
            <div className="bottom">
                <span className='left'>
                    {
                        data?.isDiscountAllowed ? (
                            <div className='discountBox'>
                                <p className='discountPrice' >NGN {formattedPrice}</p>
                                <p className='originalPrice'>NGN {data?.price.toLocaleString()}</p>
                            </div>
                        ) : (
                            <>NGN {formattedPrice}</>
                        )
                    }
                    <FavoriteBorderOutlined className='icon' />
                </span>
                <span className='right'>
                    <Link to={`/store/product/${data?._id}`}>Explore Product</Link>
                </span>
            </div>
        </div>
    </div>
  )
}

export default ProductItem