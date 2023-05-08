const catchAsync=require('./../utills/catchasync');
const { json } = require('express');
const Tour=require('./../models/tourmodel');
const AppError = require('../utills/appError');





exports.getAllTours = catchAsync (async (req, res,next) => {
 
 
  // const tours=await Tour.find();//filterig
  const queryObj={...req.query};
  const excludedFields=['page','sort','limit','fields'];
  excludedFields.forEach(el=>delete queryObj[el]);

  //advanced /// advance filter
  // console.log(queryObj);
  let queryStr=JSON.stringify(queryObj);
  console.log('query-Str:'+ queryStr);
  // console.log(queryStr);
  queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
  console.log('query-Str:'+ queryStr);
  // console.log(JSON.parse(queryStr));

  let query=Tour.find(JSON.parse(queryStr));
  // sorting
  if(req.query.sort){
    const sortby=req.query.sort.split(',').join(' ');
    query=query.sort(sortby);
  }
  // else{
  //   query=query.sort('-createdAt');
  // }
//limiting == specific fields
if(req.query.fields){
  const fields=req.query.fields.split(',').join(' ');
  query=query.select(fields);

}else{
  query=query.select('-secretTour');
}


//pagination
let page=req.query.page||1;
let limit=req.query.limit||100;
let skip=page*limit-limit;
query=query.skip(skip).limit(limit)

if(req.query.page){
  const numTours=await Tour.countDocuments();
  if(skip>numTours) throw new Error('this page does not exist');
}

  const tours=await query;
  res.status(200).json({
    status: 'success',
    tours:tours,
    
  });


});

exports.getTour = catchAsync(async (req, res,next) => {

    const tours=await Tour.findById(req.params.id);
    
    if(!tours){
      return next (new AppError('No tour found with that ID',404));
    }
    res.status(200).json({
      status: 'success',
      tour:tours,
     
    });

  });

exports.createTour = catchAsync(async (req, res,next) => {
  const newTour= await Tour.create(req.body);
  res.status(201).json({
    status:'success',
    data:{
      tour:newTour
    }
  })
});



exports.updateTour = catchAsync(async (req, res,next) => {

  const tour=await Tour.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators: true
  });
  if(!tour){
    return next (new AppError('No tour found with that ID',404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
  }
);




exports.deleteTour = catchAsync(async (req, res,next) => {
 
    const tour=await Tour.findByIdAndRemove(req.params.id);
    if(!tour){
      return next (new AppError('No tour found with that ID',404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);


exports.getTourStats=catchAsync(async (req,res,next) =>{

    const stats=await Tour.aggregate([
      {
        $match:{ ratingsAverage:{$gte:4.5}}
      },
      {
        $group:{
          _id:null,
          count: {$sum:1},
          avgRating:{$avg:'$ratingsAverage'},
          avgPrice:{$avg:'$price'},
          minPrice:{$min:'$price'},
          maxPrice:{$max:'$price'}
          

        }
      }
    ]);
    

    res.status(200).json({
      status: 'success',
      stats:stats,
    });
  
});

exports.getMonthlyplan=catchAsync(async(req,res,next)=>{



const year=req.params.year*1;

const plan=await Tour.aggregate([
  {
    $unwind:'$startDates'
  },
  {
    $match:{
      startDates:{
        $gte:new Date(`${year}-01-01`),
        $lte:new Date(`${year}-12-31`)
      }
    }
  },
  {
     $group:{
       _id : {$month:`$startDates`},
        numTourStarts : { $sum: 1},
        tours:{$push:'$name'}
       
      }
    
    },
    {
      $addFields:{month:'$_id'}
    },
    {
      $project:{
        _id:0
      }
    },
    {
      $sort:{numTourStarts:-1}
    }
]);
res.status(200).json({
  status: 'success',
  stats:plan,
});
}

);