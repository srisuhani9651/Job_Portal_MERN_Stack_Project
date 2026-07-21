import jwt from "jsonwebtoken";

export const isAuthenticated = async(req, res, next)=>{
        try {
            const token = req.cookies.token;
            if(!token){
                return res.status(400).json({message:"User not Authenticated", success: false})
            }
            const decode = await jwt.verify(token, process.env.SECRET_KEY)
            
            if(!decode){
                return res.status(200).json({message: "Invalid token"})
            }
            req.id = decode.userId
            next()
        } catch (error) {
            return res.status(400).json({message:error.message, success:false})
        }
}

