import {resend} from "./config.js";
import {verificationTokenEmailTemplate, WELCOME_EMAIL_TEMPLATE} from  "./email-templates.js";
export const sendVerificationEmail = async(email,verificationToken)=>
{
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "verify your email now",
            html: verificationTokenEmailTemplate.replace("{verificationToken}",verificationToken),
          });
        
    } catch (error) {
        console.log("error sending verifiaction email",error);
        throw new Error("error sending verification email");
    }
};
export const sendWelcomeEmail= async(email,name)=>{
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "welcome to here",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}",name),
          });
    } catch (error) {
        console.log("error sending welcome email",error);
        
    }
};

export const sendResetPasswordResetEmail= async(email,resetURL)=>{

    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Reset your password",
            html: `Click <a href="${resetURL}">here</a> to reset your password`,
          });
    } catch (error) {
        console.log("error sending welcome email",error);
        
    }
};

export const sendResetSuccessfulEmail = async(email)=>{
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "password reset was successful",
            html: `your password was reset successfully`,
          });
    } catch (error) {
        console.log("error sending password reset successfuly email",error);
        
    }
};