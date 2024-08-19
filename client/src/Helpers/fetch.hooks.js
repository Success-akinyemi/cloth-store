import axios from "axios";
import { useCallback, useEffect, useState } from "react";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_API

export function useFetchCategory(query) {
    const [cat, setCat] = useState({ isLoadingCat: true, catData: null, catStatus: null, catError: null})

    const fetchCategoryData = useCallback(async () => {
        try {

            const { data, status } = !query ? await axios.get(`/api/getCategories`) : await axios.get(`/api/${query}`)

            if (status === 200) {
                setCat({ isLoadingCat: false, catData: data, catStatus: status, catError: null })
            } else {
                setCat({ isLoadingCat: false, catData: null, catStatus: status, catError: null })
            }
        } catch (error) {
            setCat({ isLoadingCat: false, catData: null, catStatus: null, catError: error })
        }
    }, [query]);

    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]);

    return cat;
}

export function useFetchProduct(query) {
    const [product, setProduct] = useState({ isLoadingProduct: true, productData: null, productStatus: null, productError: null})

    const fetchCategoryData = useCallback(async () => {
        try {

            const { data, status } = !query ? await axios.get(`/api/product`) : await axios.get(`/api/product/${query}`)

            if (status === 200) {
                setProduct({ isLoadingProduct: false, productData: data, productStatus: status, productError: null })
            } else {
                setProduct({ isLoadingProduct: false, productData: null, productStatus: status, productError: null })
            }
        } catch (error) {
            setProduct({ isLoadingProduct: false, productData: null, productStatus: null, productError: error.response?.data?.data ? error.response?.data?.data : error })
        }
    }, [query]);

    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]);

    return product;
}

export function useFetchProductCategory(query) {
    const [productCategory, setProductCategory] = useState({ isLoadingProductCategory: true, productCategoryData: null, productSCategorytatus: null, productCategoryError: null})

    const fetchCategoryData = useCallback(async () => {
        try {

            const { data, status } = !query ? await axios.get(`/api/product`) : await axios.get(`/api/product?category=${query}`)

            if (status === 200) {
                setProductCategory({ isLoadingProductCategory: false, productCategoryData: data, productCategoryStatus: status, productCategoryError: null })
            } else {
                setProductCategory({ isLoadingProductCategory: false, productCategoryData: null, productCategoryStatus: status, productCategoryError: null })
            }
        } catch (error) {
            setProductCategory({ isLoadingProductCategory: false, productCategoryData: null, productCategoryStatus: null, productCategoryError: error })
        }
    }, [query]);

    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]);

    return productCategory;
}

export function useFetchOrder(query) {
    const [order, setOrder] = useState({ isLoadingOrder: true, orderData: null, orderStatus: null, orderError: null})

    const fetchOrderData = useCallback(async () => {
        try {

            const { data, status } = !query ? await axios.get(`/api/order/getAllOrder`, { withCredentials: true }) : await axios.get(`/api/order/getOrder/${query}`, { withCredentials: true })

            if (status === 200) {
                setOrder({ isLoadingOrder: false, orderData: data, orderStatus: status, orderError: null })
            } else {
                setOrder({ isLoadingOrder: false, orderData: null, orderStatus: status, orderError: null })
            }
        } catch (error) {
            setOrder({ isLoadingOrder: false, orderData: null, orderStatus: null, orderError: error.response?.data?.data ? error.response?.data?.data : error })
            console.log('CLG', order)
        }
    }, [query]);

    useEffect(() => {
        fetchOrderData();
    }, [fetchOrderData]);

    return order;
}

export function useFetchSpecificOrder(query) {
    const [order, setOrder] = useState({ isLoadingOrder: true, orderData: null, orderStatus: null, orderError: null})

    const fetchOrderData = useCallback(async () => {
        try {

            const { data, status } = !query ? await axios.get(`/api/order/getAllOrder`, { withCredentials: true }) : await axios.get(`/api/order/getSpecificOrder/${query}`, { withCredentials: true })

            if (status === 200) {
                setOrder({ isLoadingOrder: false, orderData: data, orderStatus: status, orderError: null })
            } else {
                setOrder({ isLoadingOrder: false, orderData: null, orderStatus: status, orderError: null })
            }
        } catch (error) {
            setOrder({ isLoadingOrder: false, orderData: null, orderStatus: null, orderError: error.response?.data?.data ? error.response?.data?.data : error })
            console.log('CLG', order)
        }
    }, [query]);

    useEffect(() => {
        fetchOrderData();
    }, [fetchOrderData]);

    return order;
}