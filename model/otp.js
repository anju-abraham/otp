const Mongoose=require('mongoose')
let otpSchema=Mongoose.Schema(
{
    email:String,
    otp:Number,
    createdAt:{type:Date,default:Date.now}
})
var otpModel=Mongoose.model("Otps",otpSchema)
module.exports={otpModel}