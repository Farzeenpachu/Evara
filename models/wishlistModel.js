const mongoose=require('mongoose')

const Schema=mongoose.Schema


    const wishlistModel = new Schema({
        id: String,
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'products'
              }
        ]
    })
const category=mongoose.model('Wishlist',wishlistModel)
module.exports=category