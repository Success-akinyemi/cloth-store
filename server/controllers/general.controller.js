import ProductCategoryModel from "../model/ProductCategory.js"

export async function getCategories(req, res){
    console.log('WO')
    try {
        const category = await ProductCategoryModel.find()
        if(!category){
            return res.status(404).json({ success: false, data: 'No category Found'})
        }
        res.status(200).json({ success: true, data: category})
    } catch (error) {
        console.log('ERROR GETTING ALL CATEGORY', error)
        res.status(500).json({ success: false, data: 'Could not get all category'})
    }
}