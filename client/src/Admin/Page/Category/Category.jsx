import './Category.css'
import '../../adminStyling.css'
import AdminSidebar from '../../Component/AdminSidebar/AdminSidebar'
import AdminAside from '../../Component/AdminAside/AdminAside'
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { addCategory } from '../../../Helpers/api'
import toast from 'react-hot-toast'
import { app } from '../../../firebase'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useFetchCategory } from '../../../Helpers/fetch.hooks'
import Spinner from '../../Component/Spinner/Spinner'

function Category({toggleMenu, menuOpen}) {
    const [ formData, setFormData ] = useState({})
    const [ image, setImage ] =  useState(undefined)
    const [ imageUploadProgress, setImageUploadProgress ] = useState(0)
    const [ imageError, setImageError ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const { isLoadingCat, catData } = useFetchCategory()
    const data = catData?.data


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
                    setFormData({ ...formData, img: downloadURL})
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
            if(!formData?.img){
                toast.error('Please Upload an image')
                return;
            }
            if(!formData.name){
                toast.error('Fill all Input Fields')
                return;
            }
            setLoading(true)
            const res = await addCategory(formData)

            if(res?.data.success){
                toast.success(res?.data.data)
                window.location.reload()
            } else(
                toast.error(res?.data)
            )
        } catch (error) {
            toast.error('Failed to upload Category')
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

  return (
    <div className='admin'>
        <div className="adminSidebar">
          <AdminSidebar toggleMenu={toggleMenu} menuOpen={menuOpen} />
        </div>

        <div className="adminContainer">
            <main className="category">
                <h1 className="h-1">Product Category</h1>

                <form onSubmit={handleSubmit} className="categoryForm">
                    <h3 className="h-3">Add new Category</h3>
                    <div className="uploadImg">
                        <input type="file" hidden ref={fileRef} accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
                        <span className="imgBtn" onClick={() => fileRef.current.click()}>
                            <AddPhotoAlternateOutlinedIcon className='imgBtnIcon' />
                            <h3 className="h-3">Upload Image</h3>
                        </span>
                    </div>
                    <p className='text-sm self-center text-center'>
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

                    <div className="productImageCard">
                        {
                            formData.img ? 
                                <img src={formData.img} className='productImage' /> 
                                :
                                <PhotoSizeSelectActualOutlinedIcon className='productImageIcon' /> 
                        
                        }
                    </div>

                    <div className="formInput">
                        <label>Category Name:</label>
                        <input required onChange={handleChange} type='text' id='name' placeholder='Category' />
                    </div>

                    <div className="categoryBtn">
                        <button disabled={loading} className='btn'>{loading ? 'Saving' : 'Save'}</button>
                    </div>
                </form>

                <div className="availableCat">
                    <h3 className="h-3">Availble Categories</h3>
                    
                    <div className="content">
                        {
                            isLoadingCat ? (
                                <Spinner />
                            ) : (
                                data?.map((item) => (
                                    <div key={item._id} className="card">
                                        <img src={item?.img} alt="" className="catImg" />
                                        <div className='info'>
                                            <p className="name">{item?.name}</p>
                                            <p className="bold id">{item?.cat}</p>
                                            <span className='options'>
                                                <div className="edit"><EditOutlinedIcon className='optionsIcon' /></div>
                                                <div className="delete"><DeleteOutlinedIcon className='optionsIcon' /></div>
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </main>
        </div>

        <div className="adminAside">
            <AdminAside toggleMenu={toggleMenu} />
        </div>

    </div>
  )
}

export default Category