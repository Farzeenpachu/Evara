const bannermodel=require('../models/Bannermodel')
module.exports={
    addbanner:(details,image)=>{
        return new Promise((resolve,reject)=>{
            const newbanner=new bannermodel({
               name:details.name,
               description:details.discription,
               heading :details.heading1,
               heading2:details.heading,
               image:image

            })
            newbanner.save().then(()=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    },
    getbanner:()=>{
        return new Promise((resolve,reject)=>{
            bannermodel.find().then((banners)=>{
                resolve(banners)
            }).catch(()=>{
                reject()
            })
        })
    },
    changebannerStatus:(id)=>{
        return new Promise((resolve,reject)=>{
            bannermodel.findById(id).then((banner)=>{
                banner.status= !banner.status
                banner.save()
                resolve()
            })
        })
    }
}