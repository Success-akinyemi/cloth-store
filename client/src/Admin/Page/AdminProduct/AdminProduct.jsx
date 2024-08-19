import './AdminProduct.css'
import '../../adminStyling.css'
import AdminSidebar from '../../Component/AdminSidebar/AdminSidebar'
import AdminAside from '../../Component/AdminAside/AdminAside'
import { useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useFetchProduct } from '../../../Helpers/fetch.hooks'
import Spinner from '../../Component/Spinner/Spinner'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import toast from 'react-hot-toast';
import { app } from '../../../firebase'
import { useFetchCategory } from '../../../Helpers/fetch.hooks';
import { updateProduct } from '../../../Helpers/api'
import CloseIcon from '@mui/icons-material/Close';

function AdminProduct({toggleMenu, menuOpen}) {
  const loc = useLocation()
  const path = loc.pathname.split('/')[2]
  const { isLoadingProduct, productData, productError } = useFetchProduct(path)
  const data = productData?.data
  console.log(data)
  const { isLoadingCat, catData } = useFetchCategory()
  const category = catData?.data
  const [ image, setImage ] =  useState(undefined)
  const [ imageUploadProgress, setImageUploadProgress ] = useState(0)
  const [ imageError, setImageError ] = useState(false)
  const [ catValue, setCatValue ] = useState([])
  const [ catText, setCatText ] = useState([])
  const [giveDiscount, setGiveDiscount] = useState(false);
  const [ percentageDiscount, setPercentageDiscount ] = useState('')
  const [ discountPrice, setDiscountPrice ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ formData, setFormData ] = useState({})

  useEffect(() => {
    if (data && data.isDiscountAllowed !== undefined) {
      setGiveDiscount(data.isDiscountAllowed);
      setFormData({ ...formData, isDiscountAllowed: giveDiscount, discountPrice: data?.discountPrice, discountPercent: data?.discountPercent})
    }
  }, [data]);

  const handleCatChange = (e) => {
    const selectedIndex = e.target.value;
    const selectedOption = category.find(item => item.cat === selectedIndex);

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
console.log('FORM DATA', formData)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const id = path
    try {
        setLoading(true)
        const res = await updateProduct(formData, id)
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
          <div className="product">
            <h1 className="h-1">Product <small>{path}</small></h1>
            {
              productError ? (
                <p style={{textAlign: 'center', fontWeight: '700', marginTop: 'auto', marginBottom: 'auto'}} className='h-1 danger'>{productError}</p>
              ) : isLoadingProduct ? (
                <div className="spin">
                  <Spinner />
                </div>
              ) : (
                <div className="content">
                  <h2 className="h-2">Product Name: {data?.name}</h2>
                  <div className="img">
                    <img src={formData?.img ? formData?.img : data?.img} alt='product' /> 
                  </div>

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
                        <div className="formInput">
                          <label>Name:</label>
                          <input defaultValue={data?.name} onChange={handleChange} required type="text" id='name' placeholder='Product Name' />
                        </div>
                        <div className="formInput">
                          <label>Price:</label>
                          <input defaultValue={data?.price} onChange={handleChange} required type="number" id='price' placeholder='Product Price' />
                        </div>
                        <div className="formInput">
                          <label>Product Description:</label>
                          <input defaultValue={data?.desc} onChange={handleChange} required type="text" id='desc' placeholder='Product Description' />
                        </div>
                        <div className="formInput">
                          <label>Product Quantity:</label>
                          <input defaultValue={data?.quantity} onChange={handleChange} required type="number" id='quantity' placeholder='Product quantity' />
                        </div>
                        <div className="formInput">
                          <label>Product size:</label>
                          <input defaultValue={data?.size} onChange={handleChange} type="text" id='size' placeholder='Product size Seprated by coma' />
                        </div>
                        <div className="formInput">
                          <label>Product Color:</label>
                          <input defaultValue={data?.color} onChange={handleChange} required type="text" id='color' placeholder='Product color Seprated by coma' />
                        </div>
                    </div>

                    <h3 className="h-2">Select Category</h3>
                    <div className="existingCat">
                      <h3 className="h-3">Existing Categories</h3>
                        <div className="exist">
                          {
                            data?.category?.map((cat) => (
                              <span className='existSpan'>{cat}</span>
                            ))
                          }
                        </div>
                    </div>
                    <select onChange={handleCatChange}>
                        <option>-- CHOOSE CATEGORY --</option>
                        {
                            category?.map((item) => (
                                <option key={item?.cat} value={item?.cat}>{item?.name}</option>
                            ))
                        }
                    </select>

                    <div className="selectedCat">
                        <h2 className="h-3">Selected Categories</h2>
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
                        <h3 className="h-2">Price Discount</h3>
                        <div className="hasDiscount">
                          <div className="h-2">Has Discount: {data?.isDiscountAllowed ? `YES (${data?.discountPercent}%)` : 'NO'}</div>
                          {data.isDiscountAllowed ? <p>NGN {data?.discountPrice}</p> : ''}
                        </div>
                        <div className="inputs">
                            <label className='h-3'>Give Discount:</label>
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
                </div>
              )
            }
          </div>
        </div>

        <div className="adminAside">
            <AdminAside toggleMenu={toggleMenu} />
        </div>

    </div>
  )
}

export default AdminProduct