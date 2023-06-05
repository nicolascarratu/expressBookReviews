const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  // Check if user session exists
  if (req.session.user) {
    // verify the JWT token generated for the user
    jwt.verify(req.session.user.token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        // If the token verification fails, respond with an error status
        res.status(401).json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        // If the token is valid, add the decoded information to the request object
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // If there's no session, return an error
    res.status(401).json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
