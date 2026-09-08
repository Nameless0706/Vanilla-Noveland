import jwt from 'jsonwebtoken';
import 'dotenv/config';
const verifyJWT = (req, res, next) => {
    //console.log(req.headers);
    const authHeader = req.get('authorization');
    if (!authHeader) return res.sendStatus(401);
    //console.log(authHeader); // Bearer + token
    const token = authHeader.split(' ')[1];
    console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // Forbidden (invalid token)
            req.user = decoded.username;
            next();
        }
    );
}

export default verifyJWT;