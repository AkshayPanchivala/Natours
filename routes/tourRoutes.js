const express = require('express');
const tourController = require('./../controllers/tourController');
const {protect,restrictto}=require('../controllers/authController');
const router = express.Router();


router
  .route('/')
  .get(protect,tourController.getAllTours)
  .post(tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats)

router.route('/monthly-plan/:year').get(tourController.getMonthlyplan);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(protect,
  restrictto('admin','lead-guide'),
  tourController.deleteTour);

module.exports = router;
