import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './Pages/Profile/Profile'
import Signin from './Pages/Signin/Signin'
import Signup from './Pages/Signup/Signup'
import Home from './Pages/Home/Home'
import { PrivateRoute, AdminRoute } from './Auth/PrivateRoute'
import { Toaster } from 'react-hot-toast'
import ProductCategory from './Pages/ProductCategory/ProductCategory'
import Product from './Pages/Product/Product'
import ProductsStore from './Pages/ProductsStore/ProductsStore'
import Cart from './Pages/Cart/Cart'
import AdminLogin from './Admin/Page/AdminLogin/AdminLogin'
import AdminDashboard from './Admin/Page/AdminDashboard/AdminDashboard'
import AdminOrders from './Admin/Page/AdminOrders/AdminOrders'
import AdminProducts from './Admin/Page/AdminProducts/AdminProducts'
import AdminProduct from './Admin/Page/AdminProduct/AdminProduct'
import Customers from './Admin/Page/Customers/Customers'
import NewProduct from './Admin/Page/NewProduct/NewProduct'
import AdminSettings from './Admin/Page/AdminSettings/AdminSettings'
import Category from './Admin/Page/Category/Category'
import Orders from './Pages/Orders/Orders'
import VerifyingPayment from './Pages/VerifyingPayment/VerifyingPayment'
import AdminOrder from './Admin/Page/AdminOrder/AdminOrder'
import { useState } from 'react'

function App() {
  const [ menuOpen, setMenuOpen ] = useState(false)

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  return (
    <div className='app'>
      <Toaster position='top-center'></Toaster>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>

            <Route path='/store/:category' element={<ProductCategory />} />
          

            <Route path='/store' element={<ProductsStore />} />
          

            <Route path='/store/product/:id' element={<Product />} />
          
          <Route element={<PrivateRoute />}>
            <Route path='/mycart' element={<Cart />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path='/myorder' element={<Orders />} />
          </Route>

          <Route path='/VerifyingPayment' element={<VerifyingPayment />} />
          
          
          //Admin Routes
          <Route element={<AdminRoute />} >
            <Route path='/adminLogin' element={<AdminLogin />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-Dashboard' element={<AdminDashboard toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-Orders' element={<AdminOrders toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-Order/:id' element={<AdminOrder toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-Products' element={<AdminProducts toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-Product/:id' element={<AdminProduct toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-Customers' element={<Customers toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-NewProduct' element={<NewProduct toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-Settings' element={<AdminSettings toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>
          <Route element={<AdminRoute />} >
            <Route path='/admin-Category' element={<Category toggleMenu={toggleMenu} menuOpen={menuOpen} />} />
          </Route>


          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App