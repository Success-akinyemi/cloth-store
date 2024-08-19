import axios from 'axios'
import OrderModel from '../model/Order.js';
import ProductModel from '../model/Product.js';

export async function checkoutPayment(req, res){
    try {
        console.log('REQ', req.body)
        const fullAmount = req.body.total * 100
        const email = req.body.email
    
        const response = await axios.post(
          `${process.env.PAYSTACK_INITIALIZE_URL}`,
          {
            email,
            amount: fullAmount,
            callback_url: `${process.env.CALLBACK_URL}`
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_TEST_SK}`,
              'Content-Type': 'application/json'
            }
          }
        );
    
        const { authorization_url, reference } = response.data.data;
        console.log('refrence',reference)

        const fullOrder = {...req.body, transactionRef: reference}

        const userOrder = new OrderModel(fullOrder)
        await userOrder.save() 

        console.log('NEW ORDER:', userOrder)
        
        res.send({ authorizationUrl: authorization_url });
    } catch (error) {
        console.log('UNABLE TO MAKE CHECKOUT PAYMENT', error)
        res.status(500).json({ success: false, data: 'Unable to create checkout payment'})
    }
}

export async function verifyPaymentWebhook(req, res){
  const { event, data } = req.body;
    if(event === 'charge.success'){
      const refrence = data.reference || ''
      const statusMsg = data.status || ''

      if(statusMsg === 'success'){
        const order = await OrderModel.findOne({ transactionRef: refrence })

        order.isVerified = true
        await order.save()
        console.log('ORDER VERIFIED')
      } else {
        console.log('PAYMENT STATUS NOT SUCCESS>>>', statusMsg)
      }

    } else if (event === 'charge.failed') {
      console.log('Transaction Failure');
    }

    res.end()
}

export async function verifyPayment(req, res){
  //console.log('VERIFICATION>>>', req.body)
  const { reference } = req.body

  try {
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    //console.log('urlll>>', verifyUrl);

    const options = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SK}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
    };

    const response = await axios.get(verifyUrl, options);
    const verificationData = response.data;
    const { status } = verificationData.data;

    if(status === 'success'){
      const order = await OrderModel.findOne({ transactionRef: reference })

      if(!order){
        return res.status(400).json({ success: false, data: 'INVALID PAYMENT'})
      }

      order.payment = true
      await order.save()
      //console.log('ORDER', order)

      const productUpdates = order.products.map(async(product) => {
        const productId = product._id;
        const quantity = product.quantity;

        const updatedProduct = await ProductModel.findOne({ _id: productId })
        if(updatedProduct){
          updatedProduct.quantity -= quantity
          await updatedProduct.save()
        }
      })

      await Promise.all(productUpdates)

      return  res.status(200).json({ success: true, data: 'Payment succesful'});
    } else{
      return res.status(400).json({ success: false, data: 'TRANSACTION NOT SUCCESSFUL'})
    }

  } catch (error) {
    console.log('ERROR VERIFYING PAYMENT', error);
    res.status(500).json({ success: false, data: 'Unable To get Donation' });
  }
}