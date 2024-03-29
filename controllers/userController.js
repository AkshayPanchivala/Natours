const User = require('../models/usermodel');
const AppError = require('../utills/appError');
const catchAsync = require('./../utills/catchasync');


/////////////////////////////////////////////////////////////////////
// get All user
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find(req.params.id);

  if (!users) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    tour: users
  });
});



////////////////////////////////////////////////////////////////////////
///get user by id
exports.getUser = catchAsync(async (req, res, next) => {
  const users = await User.findById(req.params.id);

  if (!users) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    tour: users
  });
});




//////////////////////////////////////////////////////////////////////////
//create user

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};



/////////////////////////////////////////////////////////////////
//update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const users = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!users) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated user here...>'
    }
  });
});



//////////////////////////////////////////////////////////////
///deleteme
exports.deleteme = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});




////////////////////////////////////////////////////////////
///delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const users = await User.findByIdAndRemove(req.params.id);
  if (!users) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});



//////////////////////////////////////////////////////////
//update me
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmpassword) {
    return next(new AppError('This route is not for password updates'));
  }
  const user = await User.findOne({ email: req.body.email });
  user.name = req.body.name;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success'
  });
});
