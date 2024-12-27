import {User} from "../model/user.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { genereVerificationToken } from '../utils/genereVerificationToken.js';
import { genereateJWTToken } from '../utils/gererateJWTToken.js';
import { sendVerificationEmail ,
    sendWelcomeEmail,
    sendResetPasswordResetEmail,
    sendResetSuccessfulEmail

} from "../resend/email.js";
export const signup =async(req,res)=>{
const{name,email,password}=req.body;
try{
    if(!name || !email || !password){
        return res.status(400).json({message : "all fields are required"});
    }
    const userAlreadyExists = await User.findOne({ email });
    if(userAlreadyExists){
        return res.status(400).json({message: "user already exists"});
    }
    const hashedPassword= await bcrypt.hash(password,10);
    const verificationToken = genereVerificationToken();
    const user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken : verificationToken,
        verficationTokenExpiresAt: Date.now()+ 24*60*60*1000
    });
    await user.save();
    genereateJWTToken(res,user._id);
await sendVerificationEmail(user.email,verificationToken);

    res.status(201).json({
        success: true,
        message: "user created successfully",
    user:{
        ...user._doc,
        password: undefined
    }});
}
catch(error){
    res.status(400).json({success: false,message: error.message});
}
};
export const login =async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false,meaasage:"Invalid credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({success: false,message:"Invalid credentials"});
        }
        const isVerified = user.isVerified;
        if(!isVerified){
            return res.status(400).json({success: false,message: "email not verified"});
        }
        genereateJWTToken(res,user._id);
        res.status(200).json({
            success: true,
            message: "Login Successful",
        })
    }
    catch(error){
        console.log("error logging in ",error);
        res.status(400).json({success: false, message: error.message});

    }

}
export const logout =async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logged out successfully"});

};
export const verifyEmail = async(req,res)=>{
    const{code} =req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verficationTokenExpiresAt: {$gt: Date.now()},
        })
        if(!user){
            return res.status(400).json({message:"Invalid or expired code"});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verficationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email,user.name);
        res.status(200).json({succes:true,message:"email verification success"});
    } catch (error) {
        console.log("error verifying email",error);
        res.status(400).json({success: false,message: error.message});
    }
}
export const forgotpassword = async(req,res)=>{

    const {email}=req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false,message:"user not found"});
        }
        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpiresAt = Date.now()+ 24*60*60*1000;
   
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt= resetPasswordExpiresAt;
        await user.save();
        await sendResetPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);
    
    res.status(200).json({success: true,message:"password reset email sent successfully"});
    
    } catch (error) {
        console.log("error forgot password",error);
        res.status(400).json({success: false,message: error.message});
        
    }
};
export const resetpassword = async(req,res) => {
    try {
        const{token} = req.params;
        const{password}= req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()},
        })
        if(!user){
            return res.status(400).json({success: false,message:"Invalid or expired token"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        await sendResetSuccessfulEmail(user.email);

        res.status(200).json({success: true,message:"password reset success"});
    } catch (error) {
        console.log("error resetting password",error);
        res.status(400).json({success: false,message: error.message});
        
    }
};

export const checkAuth = async(req,res) => {
    try {

const user = await User.findById(req.userId);
        if(!user){
            return res.status(401).json({success: false,message: "User not found"});
        }
        res.status(200).json({success: true, user : {...user._doc,password: undefined}});
        
    } catch (error) {
        console.log("error checking auth",error);
        res.status(500).json({success: false, message: error.message});
    }
};