import OrderModel from "../model/Order.js"


export async function createOrder(req, res){
    console.log('ORDER', req.body)
    try {
        const newOrder = new OrderModel(req.body)
        const savedOrder = await newOrder.save() 

        res.status(201).json({ success: true, data: savedOrder })
    } catch (error) {
        console.log('ERROR SAVING NEW ORDER', error)
        res.status(500).json({ success: false, data: 'Could not create new order'})
    }
}

export async function updateOrder(req, res){
    const { id } = req.body
    console.log('UPDATE ORDER', req.body)
    try {
        const updatedOrder = await OrderModel.findById({ _id: id })
        updatedOrder.status = 'Delivered'
        await updatedOrder.save()

        res.status(201).json({ success: true, data: 'Order updated succesful' })
    } catch (error) {
        console.log('ERROR UPDATING ORDER', error)
        res.status(500).json({ success: false, data: 'Could not update order'})
    }
}

export async function deleteOrder(req, res){
    try {
        await OrderModel.findByIdAndDelete(req.params.id)
        res.status(201).json({ success: true, data: 'order has been deleted.' })
    } catch (error) {
        console.log('ERROR DELETING ORDER', error)
        res.status(500).json({ success: false, data: 'Could not delete order'})
    }
}

export async function getUserOrder(req, res){
    try {
        const order = await OrderModel.find({ userId: req.params.userId })
        if(!order){
            return res.status(404).json({ success: false, data: 'No Order Found'})
        }

        res.status(200).json({ success: true, data: order})
    } catch (error) {
        console.log('ERROR GETTING ORDER', error)
        res.status(500).json({ success: false, data: 'Could not get user order'})
    }
}

export async function getAllOrder(req, res){
    try {
        const orders = await OrderModel.find()
        if(!orders){
            return res.status(404).json({ success: false, data: 'No Orders Found'})
        }
        res.status(200).json({ success: true, data: orders})
    } catch (error) {
        console.log('ERROR GETTING ALL ORDER', error)
        res.status(500).json({ success: false, data: 'Could not get all orders'})
    }
}

export async function getSpecificOrder(req, res){
    try {
        const order = await OrderModel.findById({ _id: req.params.id })
        if(!order){
            return res.status(404).json({ success: false, data: 'No Order Found'})
        }

        res.status(200).json({ success: true, data: order})
    } catch (error) {
        console.log('ERROR GETTING ORDER', error)
        res.status(500).json({ success: false, data: 'Could not get user order'})
    }
}

//GET MONTHLY INCOME
export async function getMonthlyIncome(req, res){
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await OrderModel.aggregate([
            {$match: { createdAt: {$gte: previousMonth }}},
            {
                $project:{
                    month: { $month: '$createdAt'},
                    sales: '$amount'
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: {$sum: '$sales'},
                }
            },
        ]);

        res.status(200).json({ success: true, data: income})
    } catch (error) {
        console.log('ERROR GETTING INCOME', error)
        res.status(500).json({ success: false, data: 'Could not get income'})
    }
}