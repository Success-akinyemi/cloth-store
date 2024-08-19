import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    img: {
        type: String,
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    desc: {
        type: String
    },
    quantity: {
        type: Number
    },
    size: {
        type: Array
    },
    color: {
        type: Array
    },
    category: {
        type: Array
    },
    isDiscountAllowed: {
        type: Boolean,
        default: false
    },
    discountPercent: {
        type: Number,
    },
    discountPrice: {
        type: Number
    },
    productReview: [
        {
            username: {
                type: String
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'theLimitsAsokeUsers'
            },
            review: {
                type: String
            }
        }
    ],
    likes: {
        type: Array
    }
},
{timestamps: true}
)

const ProductModel = mongoose.model('theLimitsAsokeproduct', ProductSchema)
export default ProductModel