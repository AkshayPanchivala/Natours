const mongoose = require('mongoose');

const connection = async () => {
    try{
        await mongoose.connect('mongodb+srv://aks:1456@you.xowgdbn.mongodb.net/tour?retryWrites=true&w=majority');
   
    console.log('success');
  } catch (err) {
    console.log('err');
  }
};

module.exports= connection;