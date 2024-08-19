import CartModel from "../model/Cart.js"

export async function createCart(req, res){
    console.log('CART', req.body)
    try {
        const newCart = new CartModel(req.body)
        const savedCart = await newCart.save() 

        res.status(201).json({ success: true, data: savedCart })
    } catch (error) {
        console.log('ERROR SAVING NEW PRODUCT TO CART', error)
        res.status(500).json({ success: false, data: 'Could not create cart'})
    }
}

export async function updateCart(req, res){
    const { id } = req.params
    console.log('UPDATE CART', req.body)
    try {
        const updatedCart = new CartModel.findById(
             req.params.id,
            {
                $set: req.body,
            },
            { new: true}
        )

        res.status(201).json({ success: true, data: updatedCart })
    } catch (error) {
        console.log('ERROR UPDATING CART', error)
        res.status(500).json({ success: false, data: 'Could not update cart'})
    }
}

export async function deleteCart(req, res){
    try {
        await CartModel.findByIdAndDelete(req.params.id)
        res.status(201).json({ success: true, data: 'cart has been deleted.' })
    } catch (error) {
        console.log('ERROR DELETING CART', error)
        res.status(500).json({ success: false, data: 'Could not delete cart'})
    }
}

export async function getUserCart(req, res){
    try {
        const cart = await CartModel.findOne({ userId: req.params.userId })
        if(!cart){
            return res.status(404).json({ success: false, data: 'No Cart Found'})
        }

        res.status(200).json({ success: true, data: cart})
    } catch (error) {
        console.log('ERROR GETTING CART', error)
        res.status(500).json({ success: false, data: 'Could not get user cart'})
    }
}

export async function getAllCart(req, res){
    try {
        const carts = await CartModel.find()
        if(!carts){
            return res.status(404).json({ success: false, data: 'No Carts Found'})
        }
        res.status(200).json({ success: true, data: carts})
    } catch (error) {
        console.log('ERROR GETTING ALL CART', error)
        res.status(500).json({ success: false, data: 'Could not get all cart'})
    }
}