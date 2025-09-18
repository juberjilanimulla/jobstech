import { Router } from "express";
import { successResponse,errorResponse } from "../../helper/serverResponse.js";
import usermodel from "../../models/usermodel.js";
import { comparePassword,generateAccessToken } from "../../helper/helperFunction.js";

const authRouter = Router()

authRouter.post("/signin",signinHandler);

export default authRouter

async function signinHandler(req,res){
    try {
        const {email,password} = req.body;
        console.log("body",req.body);
        if(!email ||!password){
            return errorResponse(res,400,"some params are missing")
        } 
        const users = await usermodel.findOne({ email });
        console.log("users",users)
        if (!users) {
           return errorResponse(res, 404, "email not found");
          }
    const comparepassword = comparePassword(password, users.password);
    console.log("comparepassword",comparepassword)
    if (!comparepassword) {
      return errorResponse(res, 404, "invalid password");
    }

    const userid = users._id.toString();
    
    const { encoded_token, public_token } = generateAccessToken(
      userid,
      users.email,
      users.role
    ); 
    
   successResponse(res, "SignIn successfully", {
      encoded_token,
      public_token,
    });
    } catch (error) {
        console.log("error",error);
        errorResponse(res,500,"internal server error")
    }
}
