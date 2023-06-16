const multer=require('multer')
const storage=multer.diskStorage({
    destination:'public/images/products_image',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '-' + Date.now() + Math.random() * 900 + file.originalname)
    }
})
const storage2=multer.diskStorage({
    destination:'public/images/banner',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '-' + Date.now() + Math.random() * 900 + file.originalname)
    }
})
const upload=multer({
    storage:storage
})
const upload2=multer({
    storage:storage2
})





module.exports=upload,upload2