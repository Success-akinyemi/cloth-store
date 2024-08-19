import './AdminLogin.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../../../redux/user/userslice.js'
import { apiUrl } from '../../../Utils/api.js'

function AdminLogin() {
    const {currentUser, loading, error } = useSelector(state => state.user)
    const user = currentUser?.data
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState(user?.email ||'')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(signInStart());
            const res = await fetch(apiUrl('/api/admin/adminLogin'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({email, password})
            });
            const data = await res?.json();
            if(data?.success){
              dispatch(signInSuccess(data))
              navigate('/admin-Dashboard')
            } else{
              dispatch(signInFailure(data?.data))
            }
        } catch (error) {
          const errorMsg = 'Something went wrong'
          dispatch(signInFailure(errorMsg))
          console.log('ERROR', error)
        }
      }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Admin Login</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <p className='text-2xl text-center my-4' >Hello, {user?.username}</p>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-200 p-3 rounded-lg outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p className='text-red-700'>{error && error}</p>
    </div>
  )
}

export default AdminLogin