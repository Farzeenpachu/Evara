const mongoose=require('mongoose');

const Schema = mongoose.Schema;
const userSigninSchema =new Schema({
    name:String,
    email:{
        unique:true,
        type:String,
        required:true,
        lowercase:true
    },
    phone:{
        unique:true,
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    address:[],
    wallet:{
        type:Number
    }

})

const userSignin= mongoose.model('userSignin',userSigninSchema);
module.exports=userSignin;
