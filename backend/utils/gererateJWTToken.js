import jwt from 'jsonwebtoken';
export const genereateJWTToken = (res,userId)=>{
    const token = jwt.sign({userId},process.env.JWT_secret,{
        expiresIn: "7d"
    })
    res.cookie('token',token,{
        httponly: true,
        secure:process.env.NODE_ENV ==='production',
        samSite: 'strict',
        maxAge: 7*24*60*60*1000
    })
    return token;
}