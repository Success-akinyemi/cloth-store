import { Link, useNavigate } from 'react-router-dom'
import './Signin.css'
import { useState } from 'react'
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userslice.js'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../../Component/OAuth.jsx'
import { apiUrl } from '../../Utils/api.js'

function Signin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [ formData, setFormData ] = useState({})
  const { loading, error } = useSelector((state) => state.user)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        dispatch(signInStart());
        const res = await fetch(apiUrl('/api/auth/signin'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        const data = await res?.json();
        console.log('DATA', data)
        if(data?.success){
          dispatch(signInSuccess(data))
          navigate('/')
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
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-200 p-3 rounded-lg outline-none"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-200 p-3 rounded-lg outline-none"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign up'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Do not an account?</p>
        <Link className="link" to="/signup">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>
      <p className='text-red-700'>{error && error}</p>
    </div>
  );
}

export default Signin