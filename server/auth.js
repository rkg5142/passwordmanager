const jwt = require("jsonwebtoken");

function auth(request, response, next) {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM-TOKEN");
    const userId = decodedToken.userId;
    request.user = { userId };
    next();
  } catch (error) {
    response.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
}

module.exports = auth;