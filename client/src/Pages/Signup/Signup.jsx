import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'
import { useState } from 'react';
import OAuth from '../../Component/OAuth';
import { apiUrl } from '../../Utils/api';

function Signup() {
  const navigate = useNavigate();
  const [ formData, setFormData ] = useState({})
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
        const res = await fetch(apiUrl('/api/auth/signup'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();

        if(data?.success){
          setLoading(false)
          setError('')
          navigate('/signin')
        } else{
          setLoading(false)
          setError(data?.data)
        }
    } catch (error) {
      setLoading(false)
      setError('Something went wrong')
      console.log('ERROR', error)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="bg-slate-200 p-3 rounded-lg outline-none"
          onChange={handleChange}
        />
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
        <p>Have an account?</p>
        <Link className="link" to="/signin">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
      <p className='text-red-700'>{error && error}</p>
    </div>
  );
}

export default Signup