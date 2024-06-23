require('dotenv').config();
const jwt = require('jsonwebtoken')


exports.auth = async (req, resp, next) => {
    try {
        const token = req.headers['authorization'].replace("Bearer ", "");
        if (!token) {
            resp.status(500).json({
                success: false,
                message: "token not found",
                error
            })
        }
        try {

            const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = data;
            next()

        } catch (error) {
            console.log(error)
            resp.status(400).json({
                success: false,
                message: "User not verifed",
                error
            })
        }

    } catch (error) {
        console.log("ERROR in auth middleware", error),
            resp.status(500).json({
                success: false,
                error
            })
    }
}