import express from "express";
import { config } from 'dotenv';
config();
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import CartRoutes from './routes/cart.routes.js'
import OrderRoutes from './routes/order.routes.js'
import adminRoutes from './routes/admin.routes.js'
import generalRoutes from './routes/general.routes.js'
import paystackRoutes from './routes/paystack.routes.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const corsOptions = {
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
};

app.use(cors(corsOptions));


const PORT = process.env.PORT || 9000

//Import DB
import './config/db.js'

/**HTTP get request */
app.get('/', (req, res) => {
    res.status(201).json('Home GET Request')
})

app.use('/api', generalRoutes)
app.use('/api/paystack', paystackRoutes)
app.use('/api/user', userRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cart', CartRoutes)
app.use('/api/order', OrderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)


app.listen(PORT, () => {
    console.log(`Server runing on port http://localhost:${PORT}`)
})