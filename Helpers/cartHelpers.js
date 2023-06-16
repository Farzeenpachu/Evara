const { response } = require('express')
const cartModel = require('../models/cartmodels')
const objectId = require('mongoose').ObjectId

module.exports = {
    addToCart: (id, userId) => {
        return new Promise(async (resolve, reject) => {

            const cartExist = await cartModel.findOne({ userId: userId })
            if (!cartExist) {
                const newcart = new cartModel({
                    userId: userId,
                    products: [{
                        proId: id,
                        quantity: 1
                    }]

                }).save()
                resolve()

            } else {

                let itemIndex = cartExist.products.findIndex(item => item.proId.toString() === id)
                if (itemIndex >= 0) {
                    cartExist.products[itemIndex].quantity += 1;
                } else {
                    cartExist.products.push({ proId: id, quantity: 1 })
                }
                cartExist.save()
                resolve();
            }





        }).catch((error) => {
            reject(error)
        })
    },
     getCart: (id) => {
        return new Promise((resolve, reject) => {
            const userCart = cartModel.findOne({ userId: id })

            if (!userCart) {

                reject()

            } else {
                userCart.populate({
                    path: 'products.proId',
                    select: 'productTitle productDescription productimage productPricing _id'

                }).exec().then((cartItems) => {
                    if (!cartItems) {
                        cartItems = new cartItems({
                            userId: id,
                            products: []

                        })
                    }
                    let cartprod = cartItems.products
                    cartItems = cartItems.products
                    let subtotal;
                    let totalAmount = 0;
                    cartItems.forEach(item => {

                        subtotal = item.quantity * item.proId.productPricing;
                        item.subTotal = subtotal
                        totalAmount += subtotal

                    })
                    let result = {
                        userId: id,
                        cartItems: cartItems,
                        totalAmount: totalAmount
                    }

                    if (!result) {
                        reject()
                    } else {
                        resolve({ result, cartprod });
                    }

                }).catch((error) => {
                    reject()
                })
            }

        })
    },
    RemoveProduct: (proid, Id) => {
        return new Promise(async (resolve, reject) => {
            const userCart = await cartModel.findOne({ userId: Id })
            if (userCart) {
                let itemIndex = userCart.products.findIndex(item => item.proId.toString() === proid)
                if (itemIndex >= 0) {
                    let response = {}
                    response = userCart.products.splice(itemIndex, 1)
                    await userCart.save().then(() => {
                        resolve()
                    })
                }
            } else {
                reject()
            }
        }).catch((error) => {
            reject()
        })


    },
    emptyCart: (id) => {
        return new Promise(async (resolve, reject) => {
            const userCart = await cartModel.findOne({ userId: id })
            if (userCart) {
                userCart.deleteOne().then((response) => {
                    resolve(response)
                }).catch((err) => {
                    reject()
                })
            }
        })
    },
    getCartCount: (id) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId: id })

            let cartcount = 0

            if (!cart) {
                resolve(cartcount)
            }

            if (cart) {
                cartcount = cart.products.length
            }
            resolve(cartcount)
        })
    },
    changeQuantity: (details) => {
        details.qntcount = parseInt(details.qntcount)
        details.quantity = parseInt(details.quantity)
        return new Promise(async (resolve, reject) => {
            let response
            let cart = await cartModel.findOne({ userId: details.cart })
            if (cart) {
                let itemIndex = cart.products.findIndex(item => item.proId.toString() === details.product)

                if (itemIndex >= 0) {
                    if (details.quantity == 1 && details.qntcount == -1) {
                        cart.products.splice(itemIndex, 1)
                        cart.save().then(() => {
                            response = { removeProd: true }
                            resolve(response)
                        }).catch(() => {
                            reject()
                        })

                    } else {
                        cart.products[itemIndex].quantity += details.qntcount
                        cart.save().then(() => {
                            response = { status: true }
                            resolve(response)
                        }).catch(() => {
                            reject()
                        })
                    }
                }

            }


        })
    },
    getCartProducts: (user) => {
        return new Promise((resolve, reject) => {
            cartModel.findOne({ userId: user }).then((cart) => {

                resolve(cart.products)
            })
        })
    }
}