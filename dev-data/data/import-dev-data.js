const fs=require('fs');
const connect=require('../../connection/conn');
const Tour=require('../../models/tourmodel');

connect();

const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));

const importdata=async ()=>{
    try{
        await Tour.create(tours);
        console.log('data successfully loaded');
        process.exit(1);
    }catch(err){
        throw new Error(err);
    }
 
}
const deletedata=async ()=>{
    try{
        await Tour.deleteMany();
        console.log('data successfully deleted');
        process.exit(1);
    }catch(err){
        throw new Error(err);
    }
 
}
if(process.argv[2]==importdata){
    importdata();
}else{
    deletedata();
}



