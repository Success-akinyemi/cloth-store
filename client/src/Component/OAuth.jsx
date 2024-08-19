import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userslice.js'
import { useNavigate } from 'react-router-dom'
import { apiUrl } from '../Utils/api.js'

function OAuth() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

    const handleOAuth = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result =  await signInWithPopup(auth, provider)
            const res = await fetch(apiUrl('/api/auth/google'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                name: result?.user.displayName,
                email: result?.user.email,
                photo: result?.user.photoURL
              }),
            });
            const data = await res.json()
            if(data?.success){
              dispatch(signInSuccess(data))
              navigate('/')
            }
        } catch (error) {
            console.log('could not login with google', error)
        }
    }
  return (
    <button type='button' onClick={handleOAuth} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>Continue with google</button>
  )
}

export default OAuth