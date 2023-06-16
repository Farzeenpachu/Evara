const express = require('express');
const router = express.Router();
const upload=require('../middleware/multer')
const upload2=require('../middleware/multer')
const { adminHome, adminlogin, admindash, getallusers, userStatus, getproducts, addproducts,Setproducts,logoutadmin,geteditproduct, posteditProduct,blockproduct,getcategory,addCategory,editcategory,updatecategory,blockcategory,getAllOrders, getSingleOrder, getaddbanner,postbanner,allbanner,bannerStatus,addcoupen,postAddcoupen,allcoupen,coupenStatus,orderStatus} = require('../controller/admin-controller');
const verifyadmin=(req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin')
    }
}

router.get('/', adminHome)
router.post('/', adminlogin)
router.get('/adminhome',verifyadmin, admindash)
router.get('/allusers',verifyadmin, getallusers)
router.get('/allusers/:id', verifyadmin,userStatus)
router.get('/products', getproducts)
router.get('/addproducts', verifyadmin,addproducts)
router.post('/addproducts',verifyadmin,upload.array('image',4), Setproducts)
router.get('/adminlogout',verifyadmin,logoutadmin)
router.get('/editproduct/:id',geteditproduct)
router.post('/editproduct/:id', upload.array('image',4),posteditProduct)
router.get('/blockproduct/:id',blockproduct)
router.get('/category',getcategory)
router.post('/addcategory',addCategory)
router.get('/editcategory/:id',editcategory)
router.post('/editcategory',updatecategory)
router.get('/blockcategory/:id',blockcategory)
router.get('/orderlists',verifyadmin,getAllOrders)
router.get('/singleorder/:id',getSingleOrder)
router.get('/banner',getaddbanner)
router.post('/banner',upload2.single('image'),postbanner)
router.get('/allbanners',allbanner)
router.get('/bannerstatus/:id',bannerStatus)
router.get('/addcoupen',addcoupen)
router.post('/addcoupen',postAddcoupen)
router.get('/allcoupen',allcoupen)
router.get('/coupenstatus/:id',coupenStatus)
router.post('/changeOrderStatus',orderStatus)
module.exports = router;