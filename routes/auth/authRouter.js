import { Router } from "express";
import { successResponse,errorResponse } from "../../helper/serverResponse.js";
import usermodel from "../../models/usermodel.js";

const authRouter = Router()

authRouter.post("/signin",signinHandler);

export default authRouter

async function signinHandler(req,res){
    try {
        const {email,password} = req.body;
        if(!email ||!password){
            return errorResponse(res,400,"some params are missing")
        } 
    const users = await usermodel.findOne({ email });
    if (!users) {
      return errorResponse(res, 404, "email not found");
    }
    

    } catch (error) {
        console.log("error",error);
        errorResponse(res,500,"internal server error")
    }
}
