const nodemailer=require('nodemailer');

const sendEmail=async options =>{
 
   const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
   });
   
 const mailoption={
    from:process.env.EMAIL_USER,
    to:options.email,
    subject:options.subject,
    Text:options.message,
    // html:<p> hii +name++,click <a href="http:localhost:3000/api/reset-password?token=+token+">reset your password</a>
};

await transporter.sendMail(mailoption)
}




module.exports= sendEmail;
