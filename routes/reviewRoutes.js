const express=require('express');
const {getallreviews,createReview}=require('../controllers/reviewController')
const { protect, restrictto}=require('./../controllers/authController');

const router=express.Router();


router.route('/').get(getallreviews).post(protect,restrictto('user'),createReview);


module.exports=router;
