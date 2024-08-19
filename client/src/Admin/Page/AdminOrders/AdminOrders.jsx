import './AdminOrders.css'
import '../../adminStyling.css'
import AdminSidebar from '../../Component/AdminSidebar/AdminSidebar'
import AdminAside from '../../Component/AdminAside/AdminAside'
import Spinner from '../../Component/Spinner/Spinner'
import { useFetchOrder } from '../../../Helpers/fetch.hooks'
import { useState } from 'react'
import Orders from '../../Component/Orders/Orders'


function AdminOrders({toggleMenu, menuOpen}) {
  const { isLoadingOrder, orderData, orderError } = useFetchOrder();
  const data = orderData?.data
  const sortedStoreData = data?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
  const [selectedSortOption, setSelectedSortOption] = useState('');
console.log(sortedStoreData)
  const handleSortChange = (e) => {
    setSelectedSortOption(e.target.value);
  };

    // filter data
    const filteredData = sortedStoreData?.filter((item) => {
      if (selectedSortOption === 'delivered') {
        return item?.status === 'Delivered';
      } else if (selectedSortOption === 'notDelivered') {
        return item.status === 'Pending';
      } else if (selectedSortOption === 'paid') {
        return item.payment === true;
      }
      return true;
    });

  //pagination
  const [ currentPage, setCurrentPage ] = useState(1)
  const itemsPerPage = 20
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItem = filteredData?.slice(startIndex, endIndex) 
  return (
    <div className='admin'>
        <div className="adminSidebar">
          <AdminSidebar toggleMenu={toggleMenu} menuOpen={menuOpen} />
        </div>

        <div className="adminContainer">
          <main className="orderContainer">
            <h1 className="h-1">Orders</h1>
            {
              isLoadingOrder ? (
                <div className="o-spinner">
                  <Spinner />
                </div>
              ) : orderError ? (
                <p className="errorMsg">{orderError}</p>
              ) : (
                <>
                  <div className="o-table">
                    <div className="sort">
                      <div className="sortBox">
                        <label>Sort By:</label>
                        <select value={selectedSortOption} onChange={handleSortChange}>
                          <option value="">-- NONE --</option>
                          <option value="delivered"> DELIVERED ORDER </option>
                          <option value="notDelivered"> NOT DELIVERD ORDER </option>
                          <option value="paid"> PAID ORDER </option>
                        </select>
                      </div>
                    </div>
                    <Orders data={currentItem} />
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
                      disabled={endIndex >= data?.length}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className='btn2'
                    >
                      Next
                    </button>
                  </div>
                </>
              )
            }

          </main>
        </div>

        <div className="adminAside">
          <AdminAside toggleMenu={toggleMenu} />
        </div>

    </div>
  )
}

export default AdminOrders