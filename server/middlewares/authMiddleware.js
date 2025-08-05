const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://dev-ea27dazhpocuo306.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: "https://dev-ea27dazhpocuo306.us.auth0.com/api/v2/", // same as the "audience" used in frontend
  issuer: `https://dev-ea27dazhpocuo306.us.auth0.com/`,
  algorithms: ["RS256"],
});

module.exports = checkJwt;
