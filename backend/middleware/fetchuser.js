const jwt = require("jsonwebtoken");
require('dotenv').config({path:"config.env"});
const JWT_SECRET = process.env.JWT_SECRET;


const fetchuser = (req, res, next)=>{
    // /Get usser from jwt Token and add ID to req object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send([{error : 'please authenticate using a valid token'}])
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }catch(error){
        res.status(401).send([{error : 'please authenticate'}])
    }
}

module.exports = fetchuser