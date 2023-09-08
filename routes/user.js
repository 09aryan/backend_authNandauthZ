const express=require("express");
const { signup, login } = require("../controllers/auth");
const { auth,  isStudent,isAdmin } = require("../middleware/auth");
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
//test toute routes for single middleware
    router.get("/test",auth,(req,res)=>{
        res.json({
            success:true,
            message:"Welcome to the Proetcted route for tests", 
        })
    })
//protect route
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcone to the Protected route for Students" 
    })
});
router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Protected route for admin", 
    }) 
});
// cookie parser?

module.exports=router;       