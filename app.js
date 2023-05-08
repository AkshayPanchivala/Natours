const express = require('express');
const morgan = require('morgan');
const helmet=require('helmet');
const mongosanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const ratelimit=require('express-rate-limit');



const AppError=require('./utills/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const  globalErrorHandler=require('./controllers/errorController');
const reviewRouter=require('./routes/reviewRoutes');




const app = express();


// 1) MIDDLEWARES
app.use(helmet())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter=ratelimit({
  max:10,
  windowMs:60*60*1000,
  message:'Too many requests from this IP please try again in an hour!'

});
app.use('/api',limiter);

app.use(express.json());

app.use(mongosanitize());
app.use(xss());
app.use(hpp());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter);


//routes Error handling

app.all('*',(req,res,next)=>{
next(new AppError(`can't find this page`,404));

});
app.use(globalErrorHandler);
module.exports = app;
