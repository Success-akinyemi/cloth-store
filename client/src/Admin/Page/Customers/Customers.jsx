import AdminSidebar from '../../Component/AdminSidebar/AdminSidebar'
import './Customers.css'
import '../../adminStyling.css'
import AdminAside from '../../Component/AdminAside/AdminAside'

function Customers({toggleMenu, menuOpen}) {
  return (
    <div className='admin'>
        <div className="adminSidebar">
          <AdminSidebar toggleMenu={toggleMenu} menuOpen={menuOpen} />
        </div>

        <div className="adminContainer"></div>

        <div className="adminAside">
            <AdminAside toggleMenu={toggleMenu} />
        </div>

    </div>
  )
}

export default Customers