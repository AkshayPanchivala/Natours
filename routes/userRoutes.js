const express = require('express');
const userController = require('./../controllers/userController');
const {signup, login,forgotpassword,resetpassword,updatePassword,protect} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/forgotpassword',forgotpassword);
router.patch('/resetpassword/:token',resetpassword);
router.patch('/updatepassword',protect,updatePassword);
router.patch('/updateme',protect,userController.updateMe);
router.delete('/deleteme',protect,userController.deleteme);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
