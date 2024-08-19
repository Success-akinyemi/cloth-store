import mongoose from "mongoose";

export const ProductCategorySchema = new mongoose.Schema({
    cat: {
        type: String,
        required: [true, 'Please provide a category'],
        unique: [true, 'Category already exist'],
    },
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: [true, 'Category already exist']
    },
    img: {
        type: String,
        required: [true, 'please a provide an image for the category']
    }
},
{timestamps: true}
)

const ProductCategoryModel = mongoose.model('theLimitsAsokeProductCategory', ProductCategorySchema)
export default ProductCategoryModel