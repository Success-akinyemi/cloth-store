import ProductModel from "../model/Product.js"


export async function createProduct(req, res){
    console.log('PRODUCT', req.body)
    try {
        const newProduct = new ProductModel(req.body)
        const savedProduct = await newProduct.save() 
        console.log('SAVED PRODUCT', savedProduct)
        res.status(201).json({ success: true, data: 'Product Saved Successful' })
    } catch (error) {
        console.log('ERROR SAVING NEW PRODUCT', error)
        res.status(500).json({ success: false, data: 'Could not create new product'})
    }
}

export async function updateProduct(req, res){
    const { id } = req.params
    console.log('UPDATE PRODUCT', req.body)
    try {
        const updatedProduct = new ProductModel.findById(
             req.params.id,
            {
                $set: req.body,
            },
            { new: true}
        )

        res.status(201).json({ success: true, data: updatedProduct })
    } catch (error) {
        console.log('ERROR UPDATING PRODUCT', error)
        res.status(500).json({ success: false, data: 'Could not update product'})
    }
}

export async function deleteProduct(req, res){
    try {
        await ProductModel.findByIdAndDelete({ _id: req.body.id })
        res.status(201).json({ success: true, data: 'Product deleted successful.' })
    } catch (error) {
        console.log('ERROR DELETING PRODUCT', error)
        res.status(500).json({ success: false, data: 'Could not delete product'})
    }
}

export async function getProduct(req, res){
    try {
        const product = await ProductModel.findById({ _id: req.params.id})
        if(!product){
            return res.status(404).json({ success: false, data: 'NO Product found'})
        }

        res.status(200).json({ success: true, data: product })
    } catch (error) {
        console.log('ERROR GETTING A PRODUCT', error)
        res.status(500).json({ success: false, data: 'Could not get product'})
    }
}

export async function getAllProduct(req, res){
    const sortDate = req.query.new
    const sortCategoty = req.query.category
    try {
        let products

        if(sortDate){
            products = await ProductModel.find().sort({createdAt: -1 })
        } else if(sortCategoty){
            products = await ProductModel.find({
                category: {
                    $in: [sortCategoty]
                }
            })
        } else{
            products = await ProductModel.find()
        }
        
        res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log('ERROR GETTING ALL PRODUCT', error)
        res.status(500).json({ success: false, data: 'Could not get all products'})
    }
}

export async function setDiscount(req, res){
    const { discountPercentage } = req.body
    try {
        if(!discountPercentage || isNaN(discountPercentage)){
            return res.status(404).json({ success: false, data: 'Please provide a valid discount percentage'})
        }
        const parsedDiscount = parseFloat(discountPercentage);

        if (parsedDiscount <= 0 || parsedDiscount > 100) {
            return res.status(400).json({ success: false, data: 'Discount percentage must be between 1% and 100%' });
        }

        const product = await ProductModel.findOne({ _id: req.params.id });

        if (!product) {
            return res.status(404).json({ success: false, data: 'Product not found' });
        }

        const productPrice = product.price;
        const discountPrice = (parsedDiscount * productPrice) / 100;

        product.discountPrice = discountPrice;
        await product.save();

        res.status(200).json({ success: true, data: 'Discount set successfully' });
    } catch (error) {
        console.log('ERROR SETTING PRODUCT DISCOUNT', error)
        res.status(500).json({ success: false, data: 'Could not set discount on product'})
    }
}

export async function removeDiscount(req, res){
    try {
        const product = await ProductModel.findById({ _id: req.params.id })
        if (!product) {
            return res.status(404).json({ success: false, data: 'Product not found' });
        }

        product.isDiscountAllowed = false
        product.discountPercent = undefined
        product.discountPrice = undefined
        await product.save()

        res.status(200).json({ success: true, data: 'Discount Removed successfully' });
    } catch (error) {
        console.log('ERROR REMOVING PRODUCT DISCOUNT', error)
        res.status(500).json({ success: false, data: 'Could not remove discount on product'})
    }
}
