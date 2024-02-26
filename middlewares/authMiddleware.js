const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(
    async(req, res, next) =>{
        let token;
        if( req?.headers?.authorization?.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
            console.log(token);

            try {
                if(token){
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    console.log(decoded);
                    const user = await userModel.findById(decoded?.id);
                    req.user = user;
                  
                    next();
                }
                
            } catch (error) {
                throw new Error("Not authorized, token expired. Login again.");
            }
            
        }
        else {
            throw new Error('There is no token in header. Please try again.')
        }
    }
);
const isAdmin = asyncHandler(async (req, res, next)=>{
    const {email} = req.user;
    const adminUser = await userModel.findOne({email});
    if (adminUser.role !== 'admin'){
        throw new Error("You are not an admin");
    }else {
        next();
    }
})
module.exports = {
    authMiddleware, isAdmin
}