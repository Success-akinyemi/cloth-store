import AdminSidebar from '../../Component/AdminSidebar/AdminSidebar'
import './NewProduct.css'
import '../../adminStyling.css'
import AdminAside from '../../Component/AdminAside/AdminAside'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import { app } from '../../../firebase' 
import { useFetchCategory } from '../../../Helpers/fetch.hooks';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import { addProduct } from '../../../Helpers/api';

function NewProduct({toggleMenu, menuOpen}) {
    const [ formData, setFormData ] = useState({})
    const [ image, setImage ] =  useState(undefined)
    const [ imageUploadProgress, setImageUploadProgress ] = useState(0)
    const [ imageError, setImageError ] = useState(false)
    const [ catValue, setCatValue ] = useState([])
    const [ catText, setCatText ] = useState([])
    const [ giveDiscount, setGiveDiscount ] = useState(false)
    const [ percentageDiscount, setPercentageDiscount ] = useState('')
    const [ discountPrice, setDiscountPrice ] = useState('')
    const [ loading, setLoading ] = useState(false)


    const { isLoadingCat, catData } = useFetchCategory()
    const data = catData?.data
    console.log(data)

    const handleCatChange = (e) => {
        const selectedIndex = e.target.value;
        const selectedOption = data.find(item => item.cat === selectedIndex);
    
        setCatValue((prevCatValue) => {
            if (!prevCatValue.includes(selectedOption.cat)) {
                return [...prevCatValue, selectedOption.cat];
            }
            return prevCatValue;
        });
    
        setCatText((prevCatText) => {
            if (!prevCatText.includes(selectedOption.name)) {
                return [...prevCatText, selectedOption.name];
            }
            return prevCatText;
        });
    
    };

      const handleRemoveCat = (item) => {
        const cat = item.toLowerCase().replace(/\s+/g, '');

        const index = catText.indexOf(item);

        if (index !== -1) {
            const newCatText = [...catText];
            newCatText.splice(index, 1);
            setCatText(newCatText);
        }

        const catIndex = catValue.indexOf(cat);

        if (catIndex !== -1) {
            const newCatValue = [...catValue];
            newCatValue.splice(catIndex, 1);
            setCatValue(newCatValue);
        }
      }

    useEffect(() => {
        setFormData({ ...formData, category: catValue });
    }, [catValue]);

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
        if (e.target.id === 'size' || e.target.id === 'color') {
            setFormData({ ...formData, [e.target.id]: e.target.value.split(',').map(item => item.trim()) });
        } else {
            setFormData({ ...formData, [e.target.id]: e.target.value });
        }
    }

    const handleCalculateDiscount = (e) =>{
        setPercentageDiscount(e.target.value)
    }

    useEffect(() => {
        const percent = (percentageDiscount*formData?.price) / 100
        const amount = formData?.price - percent
        setDiscountPrice(amount)
        console.log(amount)

        setFormData({ ...formData, isDiscountAllowed: giveDiscount, discountPrice: amount, discountPercent: percentageDiscount  });
    }, [percentageDiscount])

    console.log('FORMDATA',formData)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!formData?.img){
            toast.error('Upload Product Image')
        }
        if(!formData){
            toast.error('Product form cannot be empty')
        }
        if(!formData.category){
            toast.error('Chose Category for product')
        }
        try {
            setLoading(true)
            const res = await addProduct(formData)
            if(res?.data.success){
                toast.success(res?.data.data)
                window.location.reload()
            } else{
                toast.error(res?.data)
            }
        } catch (error) {
            toast.error('Failed to upload Product')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='admin'>
        <div className="adminSidebar">
          <AdminSidebar toggleMenu={toggleMenu} menuOpen={menuOpen} />
        </div>

        <div className="adminContainer">
            <main className="newProduct">
                <h1 className="h-1">Add New Product</h1>
                
                <form className="newProductForm" onSubmit={handleSubmit}>
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
                    
                    <div className="formInputs">
                        <input onChange={handleChange} required type="text" id='name' placeholder='Product Name' />
                        <input onChange={handleChange} required type="number" id='price' placeholder='Product Price' />
                        <input onChange={handleChange} required type="text" id='desc' placeholder='Product Description' />
                        <input onChange={handleChange} required type="number" id='quantity' placeholder='Product quantity' />
                        <input onChange={handleChange} type="text" id='size' placeholder='Product size Seprated by coma' />
                        <input onChange={handleChange} required type="text" id='color' placeholder='Product color Seprated by coma' />
                    </div>

                    <h3 className="h-3">Select Category</h3>
                    <select onChange={handleCatChange}>
                        <option>-- CHOOSE CATEGORY --</option>
                        {
                            data?.map((item) => (
                                <option key={item?.cat} value={item?.cat}>{item?.name}</option>
                            ))
                        }
                    </select>

                    <div className="selectedCat">
                        <h2 className="h-2">Selected Categories</h2>
                        <div className="items">
                        {
                            catText.map((item, idx) => (
                                <span key={idx} className='selectedCatItem'>                               
                                    {item}
                                    <div className="close" onClick={() => handleRemoveCat(item)}>
                                        <CloseIcon className='closeIcon' />
                                    </div>
                                </span>
                            ))
                        }
                        </div>
                    </div>
                    
                    <div className="priceDiscount">
                        <h3 className="h-3">Price Discount</h3>
                        <div className="inputs">
                            <label className='h-2'>Give Discount:</label>
                            <select onChange={(e) => setGiveDiscount(e.target.value)}>
                                <option value={false}>NO</option>
                                <option value={true}>YES</option>
                            </select>
                            {console.log('discount', giveDiscount)}

                            {
                                giveDiscount ? (
                                    <div className="discountBox">
                                        <div className="inputs">
                                            <label className='h-2'>Percentage Discount(%):</label>
                                            <input value={percentageDiscount} type="number" placeholder='Percentage Discount' onChange={(e) => handleCalculateDiscount(e)} />
                                        </div>
                                        { discountPrice ? <span className='bold'>Discount Price: {discountPrice}</span> : !formData?.price ? <span>Enter Original Product Price</span> : ''}
                                    </div>
                                ) : (
                                    null
                                )
                            }
                        </div>
                    </div>


                    <div className="submit">
                        <button type="submit" className="submitBtn">
                            {loading ? 'Uploading' : 'Add Product'}
                        </button>
                    </div>
                </form>

            </main>
        </div>

        <div className="adminAside">
            <AdminAside toggleMenu={toggleMenu} />
        </div>

    </div>
  )
}

export default NewProduct