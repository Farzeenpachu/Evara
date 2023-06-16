const mongoose =require('mongoose')
const schema=mongoose.Schema

const bannerschema=new schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    heading:{
        type:String,
        required:true
    },
    heading2:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    status: {type:Boolean ,default:true}
})

const bannerSchema=mongoose.model('banner',bannerschema)
module.exports=bannerSchema
