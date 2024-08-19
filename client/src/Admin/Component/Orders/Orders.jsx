import { Link } from 'react-router-dom'
import './Orders.css'
import Spinner from '../Spinner/Spinner'
import { formatDistanceToNow } from 'date-fns'

function Orders({ data, isLoadingOrder, orderError }) {
  return (
    <table className='orderstable'>
        {
            isLoadingOrder ? (
                <div className='orderSpinner'>
                    <Spinner />
                </div>
            ) : orderError ? (
                <p className='danger errorMsg'>{orderError}</p>
            ) : (
                <>
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Order ID</th>
                            <th>Payment</th>
                            <th>Time</th>
                            <th>Shipping Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((item) => (
                                <tr>
                                    <td>{item?.firstname} {item?.lastname}</td>
                                    <td style={{fontSize: '14px'}} >{item?._id}</td>
                                    <td>{item?.payment ? <span className='success'>Paid</span> : <span className='danger'>Unpaid</span> }</td>
                                    <td>{formatDistanceToNow(new Date(item?.createdAt))} ago</td>
                                    <td>{item?.status === 'Pending' ? <span className='warning'>{item.status}</span> : <span className='success'>{item.status}</span> }</td>
                                    <td><Link to={`/admin-Order/${item?._id}`} className='link'>Details</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                
                </>
            )
        }
    </table>
  )
}

export default Orders