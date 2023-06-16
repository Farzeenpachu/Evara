const Auth = 'aba6fb4c107559212d15bfe7f9cf8236'
const sid = 'ACefc6821ec38aa4230d02fea0f110126d'
const serviceSid = 'VAe2a000ef7ac64aef64b4b33d517d94aa'
require('dotenv').config()
const client = require('twilio')(sid, Auth)
const cartModel = require('../models/cartmodels')
const productmodel = require('../models/productsmodel')
const usermodel = require('../models/usermodels')
const ordermodel = require('../models/ordermodels')
const wishlistModel=require('../models/wishlistModel')
const bcrypt = require('bcrypt')
const Razorpay = require('razorpay');
const PDFDocument = require('pdfkit')
const fs = require('fs')
const doc = new PDFDocument()
var instance = new Razorpay({
    key_id:'rzp_test_gSKuhb79bBJ2df',
    key_secret:'tl9u7v8q2HYW6g0o0GFWjgcw',
});


module.exports = {
    createNewUser: (user) => {
        return new Promise((resolve, reject) => {
            usermodel.findOne({ phone: user.phone }).then((userexist) => {
                if (userexist) {
                    reject()
                } else {
                    bcrypt.hash(user.password, 10, (err, hashedpassword) => {
                        if (err) {
                            reject();
                        } else {
                            new usermodel({
                                name: user.Name,
                                phone: user.Number,
                                email: user.Email,
                                password: hashedpassword
                            }).save().then((newuser) => {
                                resolve(newuser)
                            }).catch((err) => {
                                reject(err)
                            })
                        }
                    })
                }
            })
        })
    },
    findUser: (user) => {
        return new Promise((resolve, reject) => {
            usermodel.findOne({ phone: user.Phone, status: true }).then((userExist) => {
                if (!userExist) {
                    reject()
                } else {
                    bcrypt.compare(user.loginpassword, userExist.password).then((status) => {
                        if (status) {
                            let response = {}
                            response.user = userExist
                            response.status = status
                            resolve(response)
                        } else {
                            reject()
                        }
                    })
                }
            })
        })
    },
    generateOtp: (user) => {
        return new Promise((resolve, reject) => {
            usermodel.findOne({ phone: user.Phone, status: true }).then((userExist) => {
                if (userExist) {
                    client.verify.v2.services(process.env.SERVIECE_SID)
                        .verifications
                        .create({ to: `+91${userExist.phone}`, channel: 'sms' })
                        .then(verification => console.log(verification.status))
                    resolve()
                } else {
                    reject()
                }
            }).catch((error) => {
                reject()
            })
        })
    },
    verifyOtp: (otp, number) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(process.env.SERVIECE_SID)
                .verificationChecks
                .create({ to: `+91${number}`, code: otp })
                .then((response) => {
                    const status = response.valid
                    usermodel.findOne({ phone: number }).then((user) => {
                        resolve({ user, status })
                    })
                }).catch((error) => {
                    reject()
                }).catch((error) => {
                    reject()
                })
        })
    },
    placeOrder: (order, Products) => {
        order.totalamount=parseInt(order.totalamount)
        
        let newproducts = Products.map((product) => ({
            id: product.proId,
            quantity: product.quantity
        }));
        return new Promise((resolve, reject) => {
            let Status = order.payment_option === 'cod' ? 'placed' : 'pending';
            usermodel.findById(order.userId).then((user)=>{
                new ordermodel({
                    userId: order.userId,
                    state: order.state,
                    name: order.name,
                    billing_address: order.billing_address,
                    zipcode: order.zipcode,
                    status: Status,
                    totalAmount: order.totalamount,
                    city: order.city,
                    date: new Date(),
                    district: order.district,
                    payment_option: order.payment_option,
                    phone: order.phone,
                    products: newproducts
                }).save().then(async(newOrder) => {
                    user.address=await newOrder.save()
                    resolve(newOrder);
                }).catch(() => {
                    reject();
                });

            })

        });
    },
    generateRazorpay:(orderId,total)=>{
        return new Promise((resolve,reject)=>{
            var options = {
                amount: total*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: ""+orderId
              };
              instance.orders.create(options, function(err, order) {
                if(err){

                }else{
                    resolve(order)
                }
              });
        })
    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'tl9u7v8q2HYW6g0o0GFWjgcw')
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            
            hmac = hmac.digest('hex')
            console.log(hmac,details['payment[razorpay_signature]'],'///////////////,,,,,,,,,,,,,,<,<<<<<<<<<<');
            if (hmac === details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }
        }).catch((err)=>{
            
            reject()
        })
    },
    changePaymentstatus:(id)=>{
       

        return new Promise((resolve,reject)=>{
            // const orderId=parseInt(id)
            ordermodel.updateOne({_id:id},{$set:{status:'placed'}}).then(()=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })

    },
    getOrders: (id) => {
        return new Promise(async (resolve, reject) => {
            await ordermodel.find({ userId: id }).then((orders) => {
                resolve(orders)
            }).catch(() => {
                reject()
            })
        })
    },
    ChangePass: (num, pass) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(pass, 10, (err, hashedpassword) => {
                if (err) {
                    reject()
                }
                usermodel.updateOne({ phone: num }, { $set: { password: hashedpassword } }).then((status) => {
                    resolve(status)
                }).catch(() => {
                    reject()
                })
            })
        })
    },
    DeleteOrders:(details)=>{
        return new Promise((resolve,reject)=>{
            ordermodel.updateOne({_id:details.orderId},{$set:{status:details.status}}).then((order)=>{
                resolve(order.status)
            }).catch((err)=>{
                reject()
            })
        })
    },
    PostAddress:(address,id)=>{
        return new Promise((resolve,reject)=>{
            usermodel.findById(id).then((user)=>{
                user.address.push(address)
                user.save()
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    },
    getOneOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            ordermodel.findById(orderId).populate('products.id').exec().then((order) => {
                const products = order.products.map(product => {
                    if (product.id) {
                        return {
                            id: product.id._id,
                            name: product.id.productTitle,
                            description: product.id.productDescription,
                            category: product.id.productCategory,
                            price: product.id.productPricing,
                            quantity: product.quantity,
                            images: product.id.productimage[0]
                        }
                    }
                });
                const orderDetails = {
                    id: order._id,
                    userId: order.userId,
                    name: order.name,
                    billingAddress: order.billing_address,
                    city: order.city,
                    state: order.state,
                    zipcode: order.zipcode,
                    phone: order.phone,
                    paymentOption: order.payment_option,
                    status: order.status,
                    products: products,
                    date: order.date,
                    totalAmount: order.totalAmount
                }
                resolve(orderDetails)
            }).catch((err) => {
                reject(err)
            })
        });
    },
    
    addToWishlist: function (userId, productId) {
        return new Promise(async (resolve, reject) => {
            let wishlist = await wishlistModel.findOne({ id: userId })
            if (wishlist) {
                await wishlistModel.findOneAndUpdate(
                    { id: userId },
                    { $addToSet: { products: productId } },
                    { new: true }
                )
                resolve()
            } else {
                wishlist = new wishlistModel({
                    id: userId,
                    products: [productId]
                })
                await wishlist.save()
                resolve()
            }
        })
    },
    wishListCount: function (userId) {
        return new Promise((resolve, reject) => {
            wishlistModel.findOne({ id: userId }).then((wishlist) => {
                if (wishlist) {
                    let count = wishlist.products.length
                    resolve(count)
                } else {
                    count = 0
                    resolve(count)
                }
            }).catch((error) => {
                console.log(error)
                reject()
            })
        })
    },
    allWishList:(userid)=>{
        return new Promise((resolve, reject) => {
            wishlistModel.findOne({id:userid}).populate('products').exec().then((wish)=>{
                console.log(wish.products);
                if(!wish){
                    resolve([])
                }else{
                    resolve(wish.products)
                }
            })
        })

        
    },
    generateInvoice: (orderDetails) => {
        console.log(orderDetails)
        return new Promise((resolve, reject) => {
            const { id, name, billingAddress, city, district, state, zipcode, phone, paymentOption, status, products, date, totalAmount } = orderDetails;

            formattedDate = date.toLocaleDateString('en-GB')

            doc.font('Times-Roman').fontSize(18).text('INVOICE', { align: 'center' });
            doc.fontSize(15).text('Shipping Address', 50, 150)
            doc.fontSize(12).text(`Name: ${name}`, 50, 180)
                .text(`Office/House No.: ${billingAddress}`)
                .text(`City: ${city}`)
                .text(`District: ${district}`)
                .text(`State: ${state}`)
                .text(`Zipcode: ${zipcode}`)
                // .text(`Phone: ${phone}`)

            doc.fontSize(15).text('Order Details', 345, 150)
            doc.fontSize(12).text(`Invoice No: ${id}`, 345, 180)
                .text(`Purchase Date: ${formattedDate}`)
                .text(`Total Amount: ${totalAmount}`)
                .text(`Payment Mode: ${paymentOption}`)
            doc.moveTo(30, 300).lineTo(580, 300).stroke();
            doc.moveTo(30, 140).lineTo(580, 140).stroke();
            doc.moveTo(30, 170).lineTo(580, 170).stroke();


            doc.fontSize(15).text('No.', 50, 340)
                .text('Name', 100, 340)
                .text('Quantity', 350, 340)
                .text('Unit Price', 450, 340)
                .text('Amount', 550, 340)

            let y = 370;
            products.forEach(({ name, price, quantity }, index) => {
                y += 30;
                doc.fontSize(12)
                    .text(`${index + 1}`, 50, y)
                    .text(name, 100, y)
                    .text(quantity, 350, y)
                    .text(price, 450, y)
                    .text(price * quantity, 550, y)
            })
            doc.fontSize(16).text('Subtotal', 400, y + 50)
            doc.fontSize(18).text(`${totalAmount}`, 550, y + 50)

            const stream = doc.pipe(fs.createWriteStream('invoice.pdf'));
            stream.on('finish', () => {
                console.log('PDF created');
                resolve();
            });
            doc.end();
        });
    },
    UserSts:(id)=>{
        return new Promise((resolve,reject)=>{
            usermodel.findById(id).then((user)=>{
                console.log(user,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                resolve(user)
            })
        })
     
    },
    userAddres:(id)=>{
        return new Promise((resolve,reject)=>{
            usermodel.findById(id).then((user)=>{
                resolve(user.address)
            }).catch(()=>{
                reject()
            })
        })
        
    },
    deleteAddress:(id,x)=>{
        return new Promise((resolve,reject)=>{
            usermodel.findById(id).then((user)=>{
                user.address.splice(x,1)
                user.save()
                resolve()
            }).catch(()=>{
                reject()
            })
        })

    }
}






