const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = require('./config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, TOKEN_KEY, async function (err, decodedToken) {
            if (err) res.status(401).json({ message: "Authentication failed!" });
            else {
                req.USER_ID = await decodedToken.userId;
                next();
            }
        });

    } catch (error) {
        res.status(401).json({ message: "Authentication failed!" });
    }
};