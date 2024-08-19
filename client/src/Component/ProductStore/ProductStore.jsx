import { Link } from 'react-router-dom'
import './ProductStore.css'
import ProductItem from '../Helpers/ProductItem/ProductItem'
import Spinner from '../../Admin/Component/Spinner/Spinner'

function ProductStore({storeData, options, isLoadingProduct}) {
  return (
    <div className='productStore'>
        { options && (
            <div className="top">
                <span>
                    Our Store
                </span>
            </div>
        )}

        <div className="middle">
            {
                isLoadingProduct ? (
                    <Spinner />
                ) : 
                (
                    storeData?.map((data, idx) => (
                        <ProductItem data={data} key={idx} />
                    ))
                )
            }
        </div>

        {
            options && (
            <div className="bottom">
                <span>
                    <Link to='store'>See More</Link>
                </span>
            </div>
        )}

    </div>
  )
}

export default ProductStore