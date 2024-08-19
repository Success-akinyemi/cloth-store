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
import schedule from 'node-schedule'
import axios from "axios";

const app = express()
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.NEBOUR_URL,
    process.env.CLIENT_URL2,
    process.env.CLIENT_URL3
];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('ORIGIN', origin)

    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },    
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

//CORN-JOB
const sendMessage = async () => {
    const res = await axios.get(`${process.env.NEBOUR_URL}/keep-alive`)

    console.log('ALIVE RESPONSE', res.data)

}
const job = schedule.scheduleJob('*/3 * * * *', () => {
    sendMessage();
});

app.listen(PORT, () => {
    console.log(`Server runing on port http://localhost:${PORT}`)
})