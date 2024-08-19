import './AdminDashboard.css'
import '../../adminStyling.css'
import AdminSidebar from '../../Component/AdminSidebar/AdminSidebar'
import { date } from '../../data/date'
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PendingIcon from '@mui/icons-material/Pending';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Orders from '../../Component/Orders/Orders';
import { order } from '../../data/order';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import AdminAside from '../../Component/AdminAside/AdminAside';
import { useFetchOrder } from '../../../Helpers/fetch.hooks';

function AdminDashboard({toggleMenu, menuOpen}) {
  const [ dateValue, setDateValue ] = useState('')
  const [ dateText, setDateText ] = useState('')
  const { isLoadingOrder, orderData, orderError } = useFetchOrder();
  const data = orderData?.data
  const sortedStoreData = data?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
  const latestStoreData = sortedStoreData?.slice(0, 8);

  const handleDateChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = date[selectedIndex];
  
    setDateValue(selectedOption.value);
    setDateText(selectedOption.text);
  };


  return (
    <div className='admin'>
        <div className="adminSidebar">
          <AdminSidebar toggleMenu={toggleMenu} menuOpen={menuOpen} />
        </div>

        <div className="adminContainer">
          <main className='dashboard'>
            <h1 className="h-1">Dashboard</h1>

            <div className="date">
              <select onChange={handleDateChange}>
                {
                  date.map((item, idx) => (
                    <option key={idx} value={`${item.value}`} >{item.text}</option>
                  ))
                }
              </select>
            </div>

            <div className="insights">
              {/** SALES */}
                <div className="sales">
                  <span className="a-iconBox"><AnalyticsIcon className='a-icon' /></span>
                  <div className="middle">
                    <div className="left">
                      <h3 className="h-3">Total Sales</h3>
                      <h1 className="h-1">30</h1>
                    </div>
                    <div className="progress">

                    </div>
                  </div>
                  <small className="small text-muted">{dateText}</small>
                </div>

              {/** DELIVERD ORDER */}
                <div className="deliverd">
                  <span className="a-iconBox"><LocalShippingIcon className='a-icon' /></span>
                  <div className="middle">
                    <div className="left">
                      <h3 className="h-3">Total Deliverd</h3>
                      <h1 className="h-1">20</h1>
                    </div>
                    <div className="progress">

                    </div>
                  </div>
                  <small className="small text-muted">{dateText}</small>
                </div>

              {/** PENDING ORDER */}
                <div className="pending">
                  <span className="a-iconBox"><PendingIcon className='a-icon' /></span>
                  <div className="middle">
                    <div className="left">
                      <h3 className="h-3">Total Pending</h3>
                      <h1 className="h-1">10</h1>
                    </div>
                    <div className="progress">

                    </div>
                  </div>
                  <small className="small text-muted">{dateText}</small>
                </div>
            </div>

            <div className="newOrders">
              <h2 className="h-2">Recent Orders</h2>
              <Orders data={latestStoreData} isLoadingOrder={isLoadingOrder} orderError={orderError} />
              <Link to='/admin-Orders' className='link menuLink'>Show All</Link>
            </div>
          </main>
        </div>

        <div className="adminAside">
          <AdminAside toggleMenu={toggleMenu} />
        </div>

    </div>
  )
}

export default AdminDashboard