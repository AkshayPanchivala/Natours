const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        validate:[validator.isEmail]
    },
    role:{
       type:String,
       enum:['user','guide','lead-guide','admin'],
       default:'user'
    },
    password:{
        type:String,
        required:true,
        // select:false
        
    },
    confirmpassword:{
        type:String,
        required:true,
        validate:{
            //this only work on save
            validator:function(el){
                return el===this.password;
            }
        }
    },
    passwordchangeat:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }


})

userschema.pre('save',async function(next)  {
    
    if(!this.isModified('password'))return next();

    const hashpassword=await bcrypt.hash(this.password,10);
    this.password=hashpassword;
    this.confirmpassword=undefined;
    next();
    return this.password;

})

userschema.pre(/^find/,function(next){
    this.find({active:{ $ne: false}});
    next();
});

userschema.methods.correctPassword=async function(candidatepassword,userpassword){
    return await bcrypt.compare(candidatepassword,userpassword);
}
userschema.methods.changedPasswordAfter=function(JWTTimestamp){
    if(this.passwordchangeat){
        const changedTimestamp=this.passwordchangeat.getTime()/1000;

        console.log(changedTimestamp,JWTTimestamp);
   
        return JWTTimestamp<changedTimestamp;
    }
    return false;
}

userschema.methods.createpaswordresettoken=function(){
  

    const resetToken=crypto.randomBytes(32).toString('hex');
    console.log(resetToken);

    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000;
    console.log(this.passwordResetExpires);

    return resetToken;
};

const User=mongoose.model('User',userschema);
module.exports=User