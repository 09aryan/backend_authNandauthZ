const mongoose=require("mongoose");
require("dotenv").config();
exports.dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
       useNEWUrlParser:true,
       useUnifiedTopology:true, 
    }).then(()=>{
        console.log("DB connected successfully")
    }).catch((err)=>{
        console.log("DB connection ISSUES");
    })
}