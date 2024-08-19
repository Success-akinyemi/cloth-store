import { useLocation } from 'react-router-dom'
import Footer from '../../Component/Footer/Footer'
import MobileNav from '../../Component/MobileNav/MobileNav'
import Navbar from '../../Component/Navbar/Navbar'
import './ProductCategory.css'
import { dateOptions, priceOptions } from '../../data.js/fliterOptions'
import ProductStore from '../../Component/ProductStore/ProductStore'
import { storeData } from '../../data.js/store'
import { useState } from 'react'
import { useFetchProductCategory } from '../../Helpers/fetch.hooks'
import Spinner from '../../Admin/Component/Spinner/Spinner'

function ProductCategory() {
    const loc = useLocation()
    const path = loc.pathname.split('/')[2]
    const { isLoadingProductCategory, productCategoryData } = useFetchProductCategory(path)
    const data = productCategoryData?.data

    const [selectedPriceOption, setSelectedPriceOption] = useState('');
    const [selectedDateOption, setSelectedDateOption] = useState('');

    //Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const itemPerPage = 20

    const resetFilters = () => {
        setSelectedPriceOption('');
        setSelectedDateOption('');
      };
    
      const filterData = data?.sort((a, b) => {
        // Price Filter
        if (selectedPriceOption === 'low') {
          return a.price - b.price; // Sort by low price
        } else if (selectedPriceOption === 'high') {
          return b.price - a.price; // Sort by high price
        }
      
        // Date Filter
        if (selectedDateOption === 'old') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Sort by oldest date
        } else if (selectedDateOption === 'new') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Sort by latest date
        }
      
        return 0;
      });

    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;

    const currentItem = data?.slice(startIndex, endIndex)

  return (
    <div className='bg productCategory'>
        <Navbar />
        <MobileNav />

        <div className="body">
            <div className="top">
                Category: {path}
            </div>
            <div className="filter">
                <div className="filter-1">
                    <span>Price:</span>
                    <select
                      value={selectedPriceOption}
                      onChange={(e) => setSelectedPriceOption(e.target.value)}
                    >
                        <option value='' onClick={resetFilters}>-- Price --</option>
                        {
                            priceOptions.map((item, idx) => (
                                <option key={idx} value={item.key} >{item.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="filter-1">
                    <span>Date:</span>
                    <select
                      value={selectedDateOption}
                      onChange={(e) => setSelectedDateOption(e.target.value)}
                    >
                        <option value='' onClick={resetFilters}>-- Date --</option>
                        {
                            dateOptions.map((item, idx) => (
                                <option key={idx} value={item.key} >{item.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div className="content">
            {
                isLoadingProductCategory ? (
                  <Spinner />
                ) : (
                  <ProductStore  
                      options={false}
                      storeData={currentItem || data}
                  />
                )
              }
            </div>

            {/* Pagination controls */}
            <div className="pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className='btn1'
            >
                Previous
            </button>
            <span className='text'>Page {currentPage}</span>
            <button
                disabled={endIndex >= storeData.length}
                onClick={() => setCurrentPage(currentPage + 1)}
                className='btn2'
            >
                Next
            </button>
            </div>

        </div>

        <Footer />
    </div>
  )
}

export default ProductCategory