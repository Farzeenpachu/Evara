const express = require('express');
const router = express.Router();
const { getHome , getSignin, postsignin, getlogin,postlogin,otplogin,sendotp, otpceck,logout,userprofile,shop,singleproducts,addtocart,getcart,forgotpass,removeProduct,clearCart,changequantity,getcheckout,postcheckout,placeOrder,postforgotpass,postforgototp,changepass,getsearchproducts,deleteOrder,verifypayment,getaddress,postaddress, OneOrder, addWishlist, getWish, getInvoice, allAdress, deltAdress} = require('../controller/user-controller');
const cart = require('../models/cartmodels');
const { UserSts } = require('../Helpers/userHelper');

const verifyUser=(req,res,next)=>{
    if(req.session.user){
        UserSts(req.session.user._id).then((nsuer)=>{
            if(nsuer.status){
                next()
            }else{
                req.session.destroy()
                res.redirect('/login')
            }
        })
       
    }else {
        
    }
}



//<--************************************************************    GET users listing.     ***************************************************************-->
router.get('/',getHome)
router.get('/signup',getSignin)
router.post('/signup',postsignin)
router.get('/login',getlogin)
router.post('/login',postlogin)
router.get('/logout',logout)
router.get('/otplogin',otplogin)
router.post('/otplogin',sendotp)
router.post('/otpverify',otpceck)
router.get('/profile',verifyUser,userprofile)

// <--**********************************************************    Shop Router        *************************************************************-->
router.get('/shop',shop)
router.get('/singleproduct/:id',singleproducts)
router.post('/search/:key',getsearchproducts)

// <--**********************************************************      Cart Router     *************************************************************-->
router.get('/add-to-cart/:id',verifyUser,addtocart)
router.get('/cart',verifyUser,getcart)
router.get('/removecart/:id',verifyUser,removeProduct)
router.get('/clearCart/:id',verifyUser,clearCart)
router.post('/change-product-quantity',verifyUser,changequantity)
//<--***********************************************************      CheckOut        *************************************************************-->

router.get('/checkout',verifyUser,getcheckout)
router.post('/checkout',verifyUser,postcheckout)
router.post('/changeOrderStatus',verifyUser,deleteOrder)

//<--***********************************************************   ForgotPassword     *************************************************************--> 

router.get('/forgotpass',verifyUser,forgotpass)
router.post('/forgotpass',verifyUser,postforgotpass)
router.post('/forgototp',verifyUser,postforgototp)
router.post('/changepass',verifyUser,changepass)
router.post ('/verify-payment',verifyUser,verifypayment)
router.get('/orderplaced',verifyUser,placeOrder)
router.get('/addaddress',verifyUser,getaddress)
router.post('/addaddress',verifyUser,postaddress)
router.get('/singleorder/:id',verifyUser,OneOrder)
router.get('/add-wishlist/:id',verifyUser,addWishlist)
router.get('/wishlist',verifyUser,getWish)
router.get('/invoice/:id',getInvoice)
router.get('/alladdress',verifyUser,allAdress)
router.get('/deleteaddress/:id',verifyUser,deltAdress)

module.exports = router;
