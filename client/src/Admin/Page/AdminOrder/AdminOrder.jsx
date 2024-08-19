import { useLocation } from "react-router-dom";
import AdminAside from "../../Component/AdminAside/AdminAside";
import AdminSidebar from "../../Component/AdminSidebar/AdminSidebar";
import "./AdminOrder.css";
import { useFetchSpecificOrder } from "../../../Helpers/fetch.hooks";
import Spinner from "../../Component/Spinner/Spinner";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { useState } from "react";
import { updateDeliverOrder } from "../../../Helpers/api";

function AdminOrder({toggleMenu, menuOpen}) {
  const loc = useLocation();
  const path = loc.pathname.split("/")[2];
  const { isLoadingOrder, orderData, orderError } = useFetchSpecificOrder(path);
  const data = orderData?.data;
  const [ loading, setLoading ] = useState(false)

  const handleDeliverOrder = async (id) => {
    const confirm = window.confirm('Are you sure you want to mark this order as delivered?')
    if(confirm){
      if(!id){
        toast.error('Invalid order selected')
        return;
      }
      try {
        setLoading(true)
        const res = await updateDeliverOrder({id})
        console.log('res', res)
        if(res?.data.success){
          toast.success(res?.data.data)
          window.location.reload()
        } else{
          toast.error(res?.data)
        }
      } catch (error) {
        toast.error('Failed to upload Order')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="admin">
      <div className="adminSidebar">
        <AdminSidebar toggleMenu={toggleMenu} menuOpen={menuOpen} />
      </div>

      <div className="adminContainer">
        <main className="orderPage">
          <h1 className="h-1">
            Orders: <small>{path}</small>
          </h1>
          {
            isLoadingOrder ? (
              <div className="orderSpinner">
                <Spinner />
              </div>
            ) : orderError ? (
              <p className="errorMsg">{orderError}</p>
            ) : (
              <>
                <div className="container">
                  <div className="top">
                    <div className="info">
                      <span>
                        ORDER PLACED:{" "}
                        {data?.createdAt && format(data.createdAt, "dd MMM yyyy")}
                      </span>
                      <span>
                        DELIVERY STATUS:{" "}
                        <p
                          className={`payment ${
                            data?.status === "Pending" ? "warning" : "success"
                          }`}
                        >
                          {data?.status}
                        </p>
                      </span>
                    </div>
                    <div className="info">
                      <span
                        style={{ display: "flex", alignItems: "center", gap: "5px" }}
                      >
                        Payment:{" "}
                        <p
                          style={{ fontWeight: "700px" }}
                          className={`${data?.payment ? "delivered" : "pending"}`}
                        >
                          {data?.payment ? "Paid" : "Not Paid"}
                        </p>
                      </span>
                      <span style={{ fontWeight: "700px" }}>
                        Total: {data?.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {data?.products.map((p, idx) => (
                    <div key={idx} className="middle">
                      <div className="img">
                        <img src={p?.img} alt="product" />
                      </div>
                      <div className="productInfo">
                        <span>NAME: {p.name}</span>
                        <span>QUANTITY: {p?.quantity}</span>
                        {p?.size.length > 0 && (
                          <span>
                            SIZE:{" "}
                            {p?.size.map((s) => (
                              <>{s},</>
                            ))}
                          </span>
                        )}
                        <span>COLOR: {p?.color}</span>
                        <span>UNIT PRICE: {p?.price}</span>
                        <span>TOTAL PRICE: {p?.price * p?.quantity}</span>
                      </div>
                    </div>
                  ))}

                  <div className="bottom">
                    <h3 style={{ fontWeight: "600" }} className="h-3">
                      Delivery Information:
                    </h3>
                    <div
                      style={{
                        fontSize: "18px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span>
                        Customer Name: {data?.firstname} {data?.lastname}
                      </span>
                      <span>Country: {data?.country}</span>
                      <span>State: {data?.state}</span>
                      <span>House Address: {data?.houseaddress}</span>
                      <span>Phone Number: {data?.phonenumber}</span>
                    </div>
                  </div>
                </div>

                <div className="checked">
                  <div className="completeOrder">
                    <h2>Complete Order:</h2>
                    <button disabled={loading} onClick={() => handleDeliverOrder(data?._id)}>{loading ? 'Updating...' : 'Mark Delivered'}</button>
                  </div>
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
  );
}

export default AdminOrder;
