const layout = 'Layouts/adminLayout'
const { getAllUsers, blockUser, getallorders, singleOrder, ChangeOrderstatus, getSalesDetails, getYearlySalesDetails, getOrdersByDate, getCategorySales, coundprod, } = require('../Helpers/adminHelper')
const { addProducts, singleProduct, getProductss, editProduct, blockProduct, newCategory, getallCategory, geteditCategory, changecategory, changeStatus } = require('../Helpers/productHelpers');
const { addbanner, getbanner, changebannerStatus } = require('../Helpers/bannerHelper')
const { AddCoupen, AllCoupen, CoupenStatus } = require('../Helpers/coupenHelper')
module.exports = {
    adminHome: (req, res) => {
        if (req.session.admin) {
            res.redirect('/admin/adminhome')
        } else {
            res.render('Admin/adminLogin', { layout: false });
        }

    },
    adminlogin: async (req, res) => {
        const admin = req.body
        const credentials = { email: "admin@gmail.com", password: 'admin' }
        if (admin.email === credentials.email && admin.password === credentials.password) {
            req.session.admin = admin
            res.redirect('/admin/adminhome')
        } else {
            res.redirect('/admin')
        }
    },
    admindash: async (req, res) => {

        if (req.session.admin) {
            const salesByMonth = await getSalesDetails()
            const salesByYear = await getYearlySalesDetails()
            const ordersByDate = await getOrdersByDate()
            const categorySales = await getCategorySales()
            const currmonth = new Date().getMonth() + 1
            const currmonthsale = await salesByMonth.find(sales => sales._id === currmonth)
            const prod = await coundprod()



            getallorders().then((orders) => {

                res.render('Admin/adminDashboard', { layout, orders, currmonthsale, salesByMonth, salesByYear, ordersByDate, prod, categorySales })
            })
        } else {
            res.redirect('/admin')
        }

    },
    getallusers: (req, res) => {
        getAllUsers().then((allusers) => {
            res.render('Admin/allUsers', { layout, allusers })
        })

    },
    userStatus: (req, res) => {
        id = req.params.id
        blockUser(id).then((user) => {
            res.redirect('/admin/allusers')
        })
    },
    getproducts: (req, res) => {
        getProductss().then((products) => {
            res.render('Admin/allproducts', { layout, products })
        })
    },
    addproducts: (req, res) => {
        getallCategory().then((categories) => {
            res.render("Admin/Addproducts", { layout, categories })
        })
    },
    Setproducts: (req, res) => {
        const product = req.body
        const image = req.files.map((file) => {
            return file.filename
        })
        addProducts(product, image).then(() => {
            res.redirect('/admin/products')
        }).catch((err) => {
            res.redirect('/admin/allproducts')
        })
    },
    logoutadmin: (req, res) => {
        req.session.destroy()
        res.redirect('/admin')
    },
    geteditproduct: (req, res) => {
        const id = req.params.id
        getallCategory().then((categories) => {
            singleProduct(id).then((items) => {
                res.render('Admin/editproduct', { items, layout, categories })
            })
        })


    },
    posteditProduct: (req, res) => {
        const product = req.body
        const id = req.params.id
        let files = req.files
        let image
        if (!files) {

            image = null

        } else {
            image = files.map((file) => {
                return file.filename
            })
        }

        editProduct(id, product, image).then(() => {
            res.redirect('/admin/products')
        }).catch((error) => {
            res.render('/admin/editproduct/id', { layout })
        })
    },
    blockproduct: (req, res) => {
        const id = req.params.id
        blockProduct(id).then(() => {

            res.redirect('/admin/products')
        }).catch((error) => {
            res.redirect('/admin/home')
        })
    },
    getcategory: (req, res) => {
        getallCategory().then((categories) => {

            res.render('Admin/category', { layout, categories })
        })

    },
    addCategory: (req, res) => {
        const category = req.body.category
        newCategory(category).then(() => {
            res.redirect('/admin/category')
        }).catch((error) => {
            res.redirect('/admin/category')
        })
    },
    editcategory: (req, res) => {
        const id = req.params.id
        geteditCategory(id).then((category) => {
            res.render('Admin/editCategory', { layout, category })
        })
    },
    updatecategory: (req, res) => {
        const category = req.body.categoryname
        const id = req.body.hiddenname
        changecategory(id, category).then(() => {
            res.redirect('/admin/category')
        }).catch(() => {
            res.redirect('/admin/edit')
        })
    },
    blockcategory: (req, res) => {
        const id = req.params.id
        changeStatus(id).then(() => {
            res.redirect('/admin/category')
        }).catch(() => {
            res.redirect('/admin/category')
        })
    },
    getAllOrders: async (req, res) => {
        await getallorders().then((orders) => {

            res.render('Admin/OrdersList', { layout, orders })
        })
    },
    getSingleOrder: (req, res) => {
        const orderId = req.params.id
        singleOrder(orderId).then((orderdetails) => {
            let total = 0
            res.render('Admin/OrderDetails', { layout, orderdetails, total })
        })
    },
    getaddbanner: (req, res) => {
        res.render('Admin/addBanner', { layout })
    },
    postbanner: (req, res) => {
        let image = req.file.filename
        addbanner(req.body, image).then(() => {
            res.redirect('/admin/banner')
        })

    },
    allbanner: (req, res) => {
        getbanner().then((banners) => {
            res.render('Admin/allBanners', { layout, banners })
        })
    },
    bannerStatus: (req, res) => {
        const id = req.params.id
        changebannerStatus(id).then(() => {
            res.redirect('/admin/allbanners')
        })

    },
    addcoupen: (req, res) => {
        res.render('Admin/addcoupen', { layout })
    },
    postAddcoupen: (req, res) => {
        AddCoupen(req.body).then(() => {
            res.redirect('/admin/addcoupen')
        })
    },
    allcoupen: (req, res) => {
        AllCoupen().then((coupens) => {
            res.render('Admin/AllCoupen', { layout, coupens })
        })
    },
    coupenStatus: (req, res) => {
        const id = req.params.id
        CoupenStatus(id).then(() => {
            res.redirect('/admin/allcoupen')
        })
    },
    orderStatus: (req, res) => {
        ChangeOrderstatus(req.body).then((status) => {
            res.json(status)
        })
    },


}