const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, '23YS8deU3%n2958cs12*Un328NJJ8*&823HIi234$8LcoWn3rn');
        next();
    } catch (error) {
        res.status(401).json({message: 'User failed!'});
    }
};