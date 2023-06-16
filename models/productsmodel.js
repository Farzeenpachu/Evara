const mongoose = require('mongoose')
const schema = mongoose.Schema

const productschema = new schema({
    productTitle: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productPricing: {
        type: Number,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productStockStatus: {
        type: Boolean,
        required: true
    },
    productimage:[]
})

const products = mongoose.model('products', productschema);

module.exports = products;