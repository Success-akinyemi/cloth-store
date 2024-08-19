import './AdminSettings.css'
import '../../adminStyling.css'
import AdminSidebar from '../../Component/AdminSidebar/AdminSidebar'
import AdminAside from '../../Component/AdminAside/AdminAside'

function AdminSettings({toggleMenu, menuOpen}) {
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

export default AdminSettings