const coupenModel=require('../models/coupenModel')
module.exports={
AddCoupen:(details)=>{
    return new Promise((resolve,reject)=>{
        const newcoupen=new coupenModel({
            code:details.code,
            validity:details.validity,
            name:details.name,
            minAmound:details.minamound,
            maxAmound:details.maxamound,
            perc:details.disperc
        })
        newcoupen.save().then(()=>{
            resolve()
        })
    })
},
AllCoupen:()=>{
    return new Promise((resolve,reject)=>{
        coupenModel.find().then((coupens)=>{
            resolve(coupens)
        })
    })
},
CoupenStatus:(id)=>{
    return new Promise((resolve,reject)=>{
        coupenModel.findById(id).then((coupen)=>{
            coupen.status= !coupen.status
            coupen.save()
            resolve()
        })
    })
}

}