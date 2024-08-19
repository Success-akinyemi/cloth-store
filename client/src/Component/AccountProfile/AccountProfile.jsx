import { useDispatch, useSelector } from 'react-redux'
import './AccountProfile.css'
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from '../../redux/user/userslice'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { apiUrl } from '../../Utils/api'

function AccountProfile() {
    const navigate = useNavigate()
    const { currentUser, loading, error } = useSelector(state => state.user)
    const user = currentUser.data
    const [ image, setImage ] =  useState(undefined)
    const [ imageUploadProgress, setImageUploadProgress ] = useState(0)
    const [ imageError, setImageError ] = useState(false)
    const [ formData, setFormData ] = useState({})
    const dispatch = useDispatch()

    const fileRef = useRef(null)
    useEffect(() => {
        if(image){
            handleFileUpload(image);
        }
    }, [image])

    const handleFileUpload = async (image) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            'state_changed',
            (snapShot) => {
                const progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
                setImageUploadProgress(Math.round(progress));
            },
            (error) => {
                //console.log('ERROR', error)
                setImageError(true)   
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
                    setFormData({ ...formData, profilePicture: downloadURL})
                );
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart())
            const res = await fetch(apiUrl(`/api/user/update/${user._id}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData),                

            })
            const data = await res.json()
            console.log('UPDATE DATA', data)
            if(!data.success){
                dispatch(updateUserFailure(data?.data))
                return;
            } else {
                toast.success('User profile updated successful')
                dispatch(updateUserSuccess(data))
            }
            
        } catch (error) {
            const errorMsg = 'Something went wrong'
            dispatch(updateUserFailure(errorMsg))
            console.log('ERROR UPDATING USER', error)
        }
    }

    const handleDeleteAccount = async () => {
        const comfirmation = window.confirm('Are you sure you want to delete your account')
        if(comfirmation){
            try {
                dispatch(deleteUserStart())
                const res = await fetch(apiUrl(`/api/user/delete/${user._id}`),{
                    method: 'DELETE',
                    credentials: 'include'
                })
                const data = await res.json();
                console.log(data)
                if(!data?.success){
                    dispatch(deleteUserFailure(data?.data))
                    return;
                } else{
                    dispatch(deleteUserSuccess(data.data))
                    navigate('/signup')
                }
            } catch (error) {
                const errorMsg = 'Could not Delete User: Something went wrong'
                dispatch(updateUserFailure(errorMsg))
                console.log('ERROR UPDATING USER', error)
            }
        }
    }

    const handleSignOut = async () => {
        try {
            await fetch(apiUrl('/api/auth/signout'))
            dispatch(signOut())
        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div className='accountProfile'>
        <Toaster position='top-center'></Toaster>
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7 text-slate-700'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" hidden ref={fileRef} accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
                <img onClick={() => fileRef.current.click()} className='h-24 w-24 self-center mt-2 cursor-pointer rounded-full object-cover' src={formData.profilePicture || user.profilePicture} alt={`profile picture of ${user?.username}`} />
                <p className='text-sm self-center'>
                    {imageError ? (
                        <span className='text-red-700'>Error Uploading Image (file size must be less than 2 MB)</span>
                        )
                        :
                        imageUploadProgress > 0 && imageUploadProgress < 100 ? (
                            <span className='text-slate-700' >{`Uploading: ${imageUploadProgress}% complete`}</span>
                        )
                        : 
                        imageUploadProgress === 100 ? (
                            <span className='text-green-700' >Image uploaded successfully</span>
                        )
                        :
                        ''
                    }
                </p>
                <input onChange={handleChange} defaultValue={user.username} type="text" id='username' placeholder='Username' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} defaultValue={user.email} type="email" id='email' placeholder='Email' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} type="password" id='password' placeholder='Password' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} defaultValue={user.firstname} type="text" id='firstname' placeholder='First Name' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} defaultValue={user.lastname} type="text" id='lastname' placeholder='Last Name' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} defaultValue={user.country} type="text" id='country' placeholder='Country' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} defaultValue={user.state} type="text" id='state' placeholder='State' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} defaultValue={user.lga} type="text" id='lga' placeholder='Local Government Area' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} defaultValue={user.houseaddress} type="text" id='houseaddress' placeholder='House Address' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <input onChange={handleChange} defaultValue={user.phonenumber} type="number" id='phonenumber' placeholder='Phone Number' className='bg-slate-200 rounded-lg p-3 outline-none' />
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Updating' : 'Update'}</button>
            </form>
            <div className='flex mt-5 justify-between'>
                <span className='text-red-700 cursor-pointer hover:underline' onClick={handleDeleteAccount}>Delete Account</span>
                <span className='text-red-700 cursor-pointer hover:underline' onClick={handleSignOut}>Sign Out</span>
            </div>
            <p className='text-red-700 mt-5'>
                {error && error}
            </p>
        </div>
    </div>
  )
}

export default AccountProfile