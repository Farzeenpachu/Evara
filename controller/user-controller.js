const { createNewUser, findUser, generateOtp, verifyOtp, placeOrder, PostAddress, getOrders, ChangePass, DeleteOrders, generateRazorpay, changePaymentstatus, verifyPayment, getOneOrder, addToWishlist, wishListCount, allWishList, generateInvoice, UserSts, userAddres, deleteAddress } = require("../Helpers/userHelper");
const { showproducts, singleProduct, getallCategory, searchProducts, allProducts, proQuandity, AddQuandity } = require('../Helpers/productHelpers');
const { addToCart, getCart, RemoveProduct, emptyCart, getCartCount, changeQuantity, getCartProducts } = require('../Helpers/cartHelpers');
const { getbanner } = require('../Helpers/bannerHelper')
const { AllCoupen } = require('../Helpers/coupenHelper')
module.exports = {
    getHome: (req, res) => {
        if (req.session.user) {
            const user = req.session.user
            console.log(user);
            
            getCartCount(user._id).then((cartcount) => {
                getbanner().then((banners) => {
                    getallCategory().then((categories) => {
                        allProducts().then((products) => {
                            wishListCount(user._id).then((wcount) => {
                                products.length === 8
                                res.render('User/index', { user, products, cartcount, banners, categories, wcount: wcount });
                            })

                        })
                    })

                })

            })
        } else {
            res.render('User/userlogin')
        }
    },
    getSignin: (req, res) => {
        res.render('User/usersignup');
    },
    postsignin: (req, res) => {
        const user = req.body
        createNewUser(user).then((newuser) => {

            res.redirect('/otplogin');
        }).catch((error) => {

            res.redirect('/signup');
        })
    },
    getlogin: (req, res) => {
        if (req.session.user) {
            res.redirect('/')
        } else {
            res.render('User/userlogin')
        }
    },
    postlogin: (req, res) => {
        const user = req.body
        findUser(user).then((response) => {
            req.session.user = response.user
            res.redirect('/')
        }).catch((error) => {
            let err = 'invalid user'
            res.render('User/userlogin', { err })
        })
    },
    otplogin: (req, res) => {
        res.render('User/userOtpLogin')
    },
    sendotp: (req, res) => {
        const user = req.body
        generateOtp(user).then((response) => {
            req.session.Phone = user.Phone
            let Phone = user.Phone
            if (user.resend) {
                res.json({ status: true })
            } else {
                res.render('User/Otp', { Phone })
            }
        }).catch((error) => {
            res.redirect('/otplogin')
        })
    },
    otpceck: (req, res) => {
        const otp = req.body.Otp
        const number = req.session.Phone

        verifyOtp(otp, number).then((response) => {
            if (response.status) {
                req.session.user = response.user
                res.redirect('/')
            } else {
                const error = 'invalid otp'
                res.render('User/Otp', { error })
            }
        }).catch((error) => {
            res.redirect('/login')
        })
    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    },
    userprofile: (req, res) => {
        const user = req.session.user
        getOrders(user._id).then((orders) => {
            res.render('User/userProfile', { user, orders })
        }).catch(() => {
            res.redirect('/')
        })
    },
    shop: (req, res) => {
        let query = {}
        const user = req.session.user
        const page = req.query.page ? req.query.page : 1
        query.category = req.query.category
        query.sort = req.query.sort
        showproducts(page, query).then((result) => {
            const products = result.data
            const pagination = result.pagination
            getallCategory().then((categories) => {
                if (user) {
                    getCartCount(user._id).then((cartcount) => {
                        res.render('User/shop', { products, user, pagination, cartcount: cartcount, categories })
                    })
                } else {
                    res.render('User/shop', { user, products, pagination, categories })
                }
            })
        }).catch(() => {
            res.redirect('/')
        })
    },
    singleproducts: async (req, res) => {
        let cartcount = null

        const user = req.session.user
        if (user) {
            cartcount = await getCartCount(user._id)
        }
        const id = req.params.id
        singleProduct(id).then((product) => {

            res.render('User/singleProduct', { product, user, cartcount: cartcount })
        })
    },
    addtocart: (req, res) => {
        const id = req.params.id;
        const userId = req.session.user._id;
        proQuandity(id,1).then(() => {
            addToCart(id, userId).then(() => {
                getCartCount(userId).then((cartcount) => {
                    res.json({ status: true, cartcount: cartcount })
                })
            })


        }).catch((error) => {
            res.redirect('/')
        })
    },
    getcart: (req, res) => {
        if (req.session.user) {
            const user = req.session.user
            const id = req.session.user._id
            getCart(id).then((prod) => {
                cartprod = prod.cartprod
                prod = prod.result
                res.render('User/cart', { prod, user, cartprod })
            }).catch((err) => {
                res.render('User/cart', { prod: false })
            })
        } else {
            res.redirect('/login')
        }
    },
    removeProduct: (req, res) => {
        const user = req.session.user._id
        const id = req.params.id
        AddQuandity(id,1)
        RemoveProduct(id, user).then(() => {
            res.redirect('/cart')
        }).catch((err) => {
            res.redirect('/cart')
        })
    },
    clearCart: (req, res) => {
        const user = req.session.user._id
        emptyCart(user).then((response) => {
            res.redirect('/cart')
        }).catch((err) => {
            res.redirect('/shop')
        })
    },
    changequantity: (req, res) => {
        console.log(req.body);
        proQuandity(req.body.product,req.body.qntcount)
        changeQuantity(req.body).then((response) => {
            res.json(response)
        }).catch((err) => {

        })
    },
    getcheckout: (req, res) => {
        const user = req.session.user

        const address = user.address
        console.log(address,'???????????????>>>>>>>>><<<<<<<<<<<<<<<<<<<<{{{{{{{{{{{{{{{{{{');
        getCart(user._id).then((prod) => {
            AllCoupen().then((coupens) => {
                cartprod = prod.cartprod
                prod = prod.result
                res.render('User/checkout', { user, prod, cartprod, coupens, address })
            })

        })
    },
    postcheckout: async (req, res) => {
        let products = await getCartProducts(req.body.userId)
        placeOrder(req.body, products).then((response) => {
            if (response.payment_option === 'cod') {
                emptyCart(req.body.userId).then(() => {
                    res.json({ cod: true })
                })
            } else if (response.payment_option === 'online') {
                const total = req.body.totalamount
                const orderId = response._id;
                generateRazorpay(orderId, total).then((order) => {
                    res.json(order)
                })
            }
        }).catch((error) => {

            res.redirect('/shop')
        });
    },
    placeOrder: (req, res) => {
        res.render('User/orderPlaced')
    },
    forgotpass: (req, res) => {
        res.render('User/forgot')
    },
    postforgotpass: (req, res) => {
        const user = req.body
        generateOtp(user).then((response) => {
            req.session.Phone = user.Phone
            let Phone = user.Phone
            if (user.resend) {
                res.json({ status: true })
            } else {
                res.render('User/Otpforgot', { Phone })
            }
        }).catch((error) => {
            res.redirect('/forgotpass')
        })
    },
    postforgototp: (req, res) => {
        const otp = req.body.Otp
        const number = req.session.Phone

        verifyOtp(otp, number).then((response) => {
            if (response.status) {
                req.session.user = response.user
                res.render('User/changepass', { number })
            } else {
                const error = 'invalid otp'
                res.render('User/Otpforgot', { error })
            }
        }).catch((error) => {
            res.redirect('/forgotpass')
        })
    },
    changepass: (req, res) => {
        const number = req.body.Number
        const password = req.body.password
        ChangePass(number, password).then((response) => {

            res.redirect('/login')
        }).catch(() => {
            res.render('User/Page-404')
        })
    },
    getsearchproducts: (req, res) => {
        const search = req.params.key
        searchProducts(search).then((value) => {
            res.json(value)
        })
    },
    deleteOrder: (req, res) => {
        DeleteOrders(req.body).then((response) => {
            res.json(response)
        }).catch(() => {
            res.render('User/Page-404')
        })
    },
    verifypayment: (req, res) => {

        verifyPayment(req.body).then(() => {
            changePaymentstatus(req.body['order[receipt]']).then(() => {
                emptyCart(req.session.user._id).then(() => {
                    res.json({ status: true })
                })
            }).catch((err) => {

                res.json({ status: false })
            })
        })
    },
    getaddress: (req, res) => {
        res.render('User/AddAdress')
    },
    postaddress: (req, res) => {
        const address = req.body
        const id = req.session.user._id
        PostAddress(address, id).then(() => {
            res.redirect('/addaddress')
        }).catch(() => {
            res.render('User/Page-404')
        })
    },
    OneOrder: (req, res) => {
        const id = req.params.id
        getOneOrder(id).then((orderdetails) => {
            let total = 0
            res.render('User/OrderView', { orderdetails, total })
        })
    },
    addWishlist: (req, res) => {
        const proid = req.params.id
        const user = req.session.user._id
        console.log(proid, user, '>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<');
        addToWishlist(user, proid).then(() => {
            wishListCount(user).then((wcount) => {
                res.json({ status: true, wcount: wcount })
            })
        }).catch((err) => {
            console.log(err);
        })
    },
    getWish: (req, res) => {
        const id = req.session.user._id
        allWishList(id).then((prod) => {
            res.render('User/Wishlist', { prod })
        })


    },
    getInvoice: (req, res) => {
        const Id = req.params.id
        getOneOrder(Id).then((orderDetails) => {
            console.log(orderDetails);
            generateInvoice(orderDetails).then(() => {
                res.download('invoice.pdf')
            }).catch((err) => {
                console.log('Error creating invoice PDF:', err);
            })
        })
    },
    allAdress:(req,res)=>{
       const id= req.session.user._id
       userAddres(id).then((address)=>{
        console.log(address);
        res.render('User/AllAddress',{address})
       })
    },
    deltAdress:(req,res)=>{
        const id=req.session.user._id
        const index=req.params.id
        deleteAddress(id,index).then(()=>{

            res.redirect('/alladdress')
        })

    }
}