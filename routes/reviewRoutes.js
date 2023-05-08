const express=require('express');
const {getallreviews,createReview}=require('../controllers/reviewController')
const router=express.Router();

const { signup, login, protect, restrictto, forgotpassword, resetpassword,updatePassword}=require('./../controllers/authController');

router.route('/').get(getallreviews).post(protect,restrictto('user'),createReview);


module.exports=router;
