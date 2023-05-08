const Review=require('../models/reviewmodel');
const catchAsync=require('../utills/catchasync');

const getallreviews=catchAsync(async (req,res,next)=>{
    const reviews=await Review.find();

    res.status(200).json({
        status:'success',
        results:reviews.length,
        data:{
            reviews
        }
    })
});

const createReview =catchAsync(async(req,res,next)=> {
    const newReview= await Review.create(req.body);

    res.status(201).json({
        status:'success',
        data:{
            Review:newReview
        }
    })

})

module.exports={getallreviews,createReview}