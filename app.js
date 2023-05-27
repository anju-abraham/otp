const Mongoose=require('mongoose')
const Express=require('express')
const Cors=require('cors')
const Bodyparser=require('body-parser');
const dotenv=require('dotenv')
const PORT=process.env.PORT||3001
const nodemailer=require('nodemailer')
const logger=require('morgan');
const { otpModel } = require('./model/otp');
dotenv.config();
const app=Express();
app.use(Bodyparser.urlencoded({extended:true}))
app.use(Bodyparser.json())
app.use(Cors())
const path = require('path'); 
app.use(Express.static(path.join(__dirname,'/build'))); 

//mongpdb
Mongoose.connect("mongodb+srv://anjuab44:pKkKcRt9Z3j1DnQP@cluster0.vxumfkk.mongodb.net/OTPDb?retryWrites=true&w=majority",{ useNewUrlParser : true})
.then(()=>{
    console.log('Connected..mongodb connected!');})
.catch(()=>{
    console.log("error mongodb not connected")
})

app.get('/*', function(req, res) { 
    res.sendFile(path.join(__dirname ,'/build/index.html')); 
    }); 
app.post("/api/submit",async(req,res)=>{
    console.log(req.body)
   let email=req.body.email;
//---------------------------
var transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        // user:process.env.EMAIL,
        // pass:process.env.PASSWORD,
        user:'anjuatvm@gmail.com',
        pass:'mtwqowelnbvljbdj',
    }
});

var mailOptions={
    from:'anjuatvm@gmail.com',
    // to:'anjuab44@gmail.com',
    to:email,
    subject:'sending OTP using nodemailer',
    text: '34567 '
   
}
transporter.sendMail(mailOptions,function(error,info){
    if(error)
    console.log(error)
    else
    console.log('Email sent '+info.response);
});


    //email,otp save to db
    let data1 = {
        email: req.body.email,
     otp:mailOptions.text,
      };
   let data=new otpModel(data1)
        let result=await data.save()
        // res.json(result)
        res.json({"status":"success","data":result})
})


app.post("/api/otpsubmit",async(req,res)=>{
    var email = req.body.email;
    var otp = req.body.otp;
    const user= await otpModel.findOne({email:req.body.email})
    if (user){
   
       
     
            if (req.body.otp !== user.otp) {
                res.json({"status":"fail","data":result})
            }
                else
                res.json({"status":"success","data":result})
        }
    })

app.listen(PORT,()=>{
    console.log(`app is running o port ${PORT}`)
})
