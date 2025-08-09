// auth.js
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const axios = require("axios");

const authConfig = {
  domain: process.env.AUTH0_DOMAIN, // e.g., dev-abc123.us.auth0.com
  audience: process.env.AUTH0_AUDIENCE, // API Identifier set in Auth0
};

// JWT validation middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

// Middleware to fetch /userinfo and attach user data
const attachUserInfo = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Missing access token" });

    const response = await axios.get(`https://${authConfig.domain}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Attach minimal user info
    const { email, name, sub } = response.data;
    req.user = { email, name, sub };
    next();
  } catch (error) {
    console.error("Error fetching userinfo:", error.message);
    return res
      .status(401)
      .json({ message: "Invalid token or userinfo fetch failed" });
  }
};

module.exports = { checkJwt, attachUserInfo };
