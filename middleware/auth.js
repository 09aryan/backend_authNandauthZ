const jwt=require("jsonwebtoken");
require("dotenv").config();
exports.auth=(req,res,next)=>{
    try{
        //extract jwt token
        //find other ways to find token
        const token=req.body.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token Missing",
            }) 
        }
        try{ 
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode; //stored the decoded data to check the role(toring the payload)
        }
        catch(err){
             return res.status(401).json({
                success:false,
                message:"token is invalid"
             }) 
        }  
        next();

    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong,while verififying the toke",
        })
    }
}
exports.isStudent = (req, res, next) => {
    try {
      if (req.user.role !== "Student") {
        return res.status(401).json({
          success: false,
          message: "This is a protected route for students",
        });
      }
      // Call next() only if the user is a student
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "User role is not matching",
      });
    }
  }; 
  exports.isAdmin = (req, res, next) => {
    try {
      if (req.user.role !== "Admin") {
        return res.status(401).json({
          success: false,
          message: "This is a protected route for admin",
        });
      }
      // Call next() only if the user is a student
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "User role is not matching",
      });
    }
  }; 