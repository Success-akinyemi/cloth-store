import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_SERVER_API

export async function addCategory(formData){
    try {
        console.log(formData)
        const res = await axios.post('/api/admin/newCategory', formData, { withCredentials: true })
        return res
    } catch (error) {
        toast.error('Failed to upload Category')
        console.log(error)
        const res = error.response.data
        return res
    }
}

export async function addProduct(formData){
    try {
        console.log(formData)
        const res = await axios.post('/api/product/createProduct', formData, { withCredentials: true })
        return res
    } catch (error) {
        toast.error('Failed to upload Product')
        console.log(error)
            const res = error.response.data
            return res
    }
}

export async function updateProduct(formData, id){
    try {
        console.log(formData)
        const res = await axios.post(`/api/product/updateProduct/${id}`, formData, { withCredentials: true })
        return res
    } catch (error) {
        toast.error('Failed to upload Product')
        console.log(error)
            const res = error.response.data
            return res
    }
}

export async function checkoutPayment(formData){
    try {
        const res = await axios.post('/api/paystack/checkoutPayment', formData)
        const authorizationUrl = res.data.authorizationUrl;
        console.log('url', authorizationUrl)
        window.location.href = authorizationUrl
    } catch (error) {
        toast.error('Failed to Create Checkout try again')
        console.log(error)
    }
}

export async function verifyPayment({reference}){
    try {
        const res = await axios.post(`/api/paystack/verifyPayment`, {reference})
        return res
    } catch (error) {
        console.log(error)
        const res = error.response.data
        return res
    }
}

export async function updateDeliverOrder({id}){
    try {
        const res = await axios.post(`/api/order/updateOrder`, {id}, { withCredentials: true })
        return res
    } catch (error) {
        const res = error.response.data
        return res
    }
}

export async function deleteProduct({id}){
    try {
        const res = await axios.post(`/api/product/deleteProduct`, {id}, { withCredentials: true })
        return res
    } catch (error) {
        const res = error.response.data
        return res
    }
}