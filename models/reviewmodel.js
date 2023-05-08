//review /rating/createdAt/ref to tour/ref to user
const mongoose=require('mongoose');

const reviewschema=new mongoose.Schema({
review:{
    type:String,
    required:[true,'Review can not be empty!']
},
rating:{
    type:Number,
    min:1,
    max:5
},
createdat:{
  type:Date,
  default:Date.now()
},
tour:{
    type:mongoose.Schema.ObjectId,
    ref:'tour',
    required:true
},
user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
}

},
{
    toJSON:{virtuals:true},
   toObject:{virtuals:true},

}
);

reviewschema.pre(/^find/,function(next){
    this.populate({
        path:'tour',
        select:'name',
        
    }).populate({
        path:'user',
        select:'name'
    })
    next();
})
const Review=mongoose.model('Review',reviewschema);

module.exports=Review;