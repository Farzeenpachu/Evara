const productmodel = require('../models/productsmodel')
const categorymodel = require('../models/categorymodels')
module.exports = {
    addProducts: (product, image) => {
        return new Promise((resolve, reject) => {
            const newproducts = new productmodel({
                productTitle: product.name,
                productDescription: product.discription,
                productCategory: product.category,
                productQuantity: product.quantity,
                productPricing: product.price,
                productimage: image,
                productStockStatus: true
            })
            newproducts.save()
            resolve()
        })
    },
    searchProducts: (key) => {
        return new Promise((resolve, reject) => {
            productmodel.aggregate([{
                $match: {
                    $or: [
                        { $and: [{ productTitle: { $regex: new RegExp(key, 'i') } }, { productStockStatus: true }] }, { productCategory: { $regex: new RegExp(key, 'i') } }
                    ]
                }
            }]).then((products) => {
                resolve(products)
            }).catch(() => {
                reject()
            })
        })
    },

    showproducts: (page, query) => {
        const PAGE_SIZE = 8
        return new Promise(async (resolve, reject) => {
            const count = await productmodel.countDocuments({ productStockStatus: true });
            const totalpages = Math.ceil(count / PAGE_SIZE)
            const currentPage = Math.max(page, 1);
            const skip = (currentPage - 1) * PAGE_SIZE;
            let queryObj = { productStockStatus: true }
            if (query && query.category) {
                queryObj.productCategory = query.category
            }
            let sortObj = {}
            if (query && query.sort) {
                if (query.sort === 'l2h') {
                    sortObj = { productPricing: 1 }

                } else if (query.sort === 'h2l') {
                    sortObj = { productPricing: -1 }
                }
            }
            const products = await productmodel
                .find(queryObj)
                .sort(sortObj)
                .skip(skip)
                .limit(PAGE_SIZE)
                .catch((error) => {
                    console.error(error);
                });
            if (products.length > 0) {
                resolve({
                    data: products,
                    pagination: {
                        currentPage,
                        totalpages,
                        pageSize: PAGE_SIZE,
                        totalItems: count
                    },
                })
            } else {
                reject()
            }
        })
    },
    singleProduct: (id) => {
        return new Promise((resolve, reject) => {
            productmodel.findOne({ _id: id }).then((product) => {
                if (product) {
                    resolve(product)
                } else {
                    reject()
                }

            })
        }).catch((err) => {
            reject()
        })

    },
    editProduct: (id, product, images) => {

        if (images.length > 0) {
            return new Promise((resolve, reject) => {
                productmodel.updateOne({ _id: id }, {
                    $set: {
                        productPricing: product.price,
                        productQuantity: product.quantity,
                        productCategory: product.category,
                        productimage: images,
                        productStockStatus: true,
                        productTitle: product.name,
                        productDescription: product.discription
                    }
                }).then(() => {
                    resolve()
                })
            }).catch((error) => {
                reject()
            })
        } else {
            return new Promise((resolve, reject) => {
                productmodel.updateOne({ _id: id }, {
                    $set: {
                        productPricing: product.price,
                        productQuantity: product.quantity,
                        productCategory: product.category,
                        productStockStatus: true,
                        productTitle: product.name,
                        productDescription: product.discription
                    }
                }).then(() => {
                    resolve()
                })
            }).catch((error) => {
                reject()
            })
        }


    },
    blockProduct: (id) => {

        return new Promise(async (resolve, reject) => {
            const item = await productmodel.findOne({ _id: id })
            if (item) {
                item.productStockStatus = !item.productStockStatus
            }
            item.save().then(() => {
                resolve()
            }).catch(() => {
                reject()
            })

        })
    },
    newCategory: (category) => {
        return new Promise((resolve, reject) => {
            categorymodel.findOne({ name: category }).then((categoryExist) => {
                if (categoryExist) {
                    reject()
                } else {
                    new categorymodel({
                        name: category
                    }).save().then((response) => {
                        resolve()
                    }).catch((error) => {
                        reject()
                    })
                }
            })
        })
    },
    getallCategory: () => {
        return new Promise((resolve, reject) => {
            categorymodel.find().then((categories) => {
                resolve(categories)
            }).catch((error) => {
                reject()
            })
        })
    },
    geteditCategory: (id) => {
        return new Promise((resolve, reject) => {
            categorymodel.findById(id).then((category) => {
                resolve(category)
            }).catch((error) => {
                reject()
            })
        })
    },
    changecategory: (id, category) => {
        return new Promise((resolve, reject) => {
            categorymodel.updateOne({ name: id }, {
                $set: { name: category }
            }).then(() => {
                productmodel.updateMany({ productCategory: id }, {
                    $set: { productCategory: category }
                }).then(() => {
                    resolve()
                })
            }).catch((error) => {
                reject();
            })
        })
    },
    changeStatus: (id) => {
        return new Promise(async (resolve, reject) => {
            let category = await categorymodel.findById(id)
            productmodel.find({ productCategory: category.name }).then((products) => {
                if (products.length == 0) {
                    category.status = !category.status

                    category.save()
                    resolve()
                } else {
                    reject()
                }
            }).catch((error) => {
                reject()
            })
        })
    },
    allProducts: () => {
        return new Promise((resolve, reject) => {
            productmodel.find().limit(8).then((products) => {
                resolve(products)
            }).catch(() => {
                reject()
            })
        })
    },
    getProductss: () => {
        return new Promise((resolve, reject) => {
            productmodel.find().then((products) => {
                resolve(products)
            }).catch(() => {
                reject()
            })
        })
    },
    proQuandity:(proid,quantity)=>{
        return new Promise(async(resolve,reject)=>{
            productmodel.findById(proid).then((newprod)=>{
                if(newprod.productQuantity!=0){
                    newprod.productQuantity=newprod.productQuantity-quantity
                    console.log(newprod.productQuantity,'///////////////////////////////////////');
                    newprod.save()
                    resolve()
                }else{
                    newprod.save()
                    resolve()
                }

                })
           
        }).catch(()=>{
            
        })
    },
    AddQuandity:(proid,quantity)=>{
        return new Promise(async(resolve,reject)=>{
            productmodel.findById(proid).then((newprod)=>{
                if(newprod.productQuantity!=0){
                    newprod.productQuantity=newprod.productQuantity+quantity
                    console.log(newprod.productQuantity,'///////////////////////////////////////');
                    newprod.save()
                    resolve()
                }else{
                    newprod.save()
                    resolve()
                }

                })
           
        }).catch(()=>{
            
        })
    }
}