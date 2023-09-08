const express=require("express");
const app=express();
require('dotenv').config();
const PORT=process.env.PORT ||400;

//parase body to get data;
app.use(express.json());
require("./config/database").dbConnect();
  
// //route import and mount
const user=require("./routes/user");
app.use("/api/v1",user);

app.listen(PORT,()=>{
    console.log("App is running")
}) 