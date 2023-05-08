const mongoose = require('mongoose');
const slugify=require('slugify');
// const validator=require('validator');
// const User=require('./usermodel');

const tourschema = new mongoose.Schema({
    
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength:[40,'a  maximum length'],
      minlength:[10,'name length too sort'],
      // validate:[validator.isAlpha,'is only alpha key']
   
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
  
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    
      
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: function(val){
        return val<this.price;
      }
      
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour:{
      type:Boolean,
      default:false
    },
    
    secretTour: {
      type: Boolean,
      default: false
    },

    startLocation:{
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinates: [Number],
      address:String,
      description:String

    },
    location:[
      {
        type:{
          type:String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number

      }
    ],
    guides:[
      {
        type:mongoose.Schema.ObjectId,
        ref:'User'
      }
    ]
  },

  {
      toJSON:{virtuals:true},
     toObject:{virtuals:true},

  }


);
tourschema.virtual('durationWeeks').get(function(){
  return this.duration/7;
});
//document Middleware 
tourschema.pre('save',function(next){
  this.slug=slugify(this.name,{lower:true});
  next();
})

tourschema.pre(/^find/,function(next){
  this.populate({path:'guides',
  select:'-__v -password'
})
next();
})

// tourschema.pre('save',async function(next){
//   const guidespromises=this.guides.map(async id=>await User.findById(id));
//  this.guides= await Promise.all(guidespromises)
//   next();
// })

//queryMiddlewaare
tourschema.pre('find',function(next){
  this.find({secretTour:{$eq:false}})
  next();
})


//aggregate function
tourschema.pre('aggregate',function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
  console.log(this.pipeline());
  next();
})

const Tour=mongoose.model('tour',tourschema);


module.exports=Tour;





