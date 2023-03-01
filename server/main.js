const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//enable logging 
const winston = require('winston');

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const auth = require("./auth");
const secretsModel = require("./db/secretsModel");


// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", async (request, response) => {
  try {
    // Hash the password
    const hashedPassword = await argon2.hash(request.body.hashedPassword);

    // Create a new user instance and collect the data
    const user = new User({
      email: request.body.email,
      password: hashedPassword,
    });

    // Save the new user
    const result = await user.save();
    
    // Return success if the new user is added to the database successfully
    response.status(201).send({
      message: "User Created Successfully",
      result,
    });
  } catch (error) {
    // Catch error if the new user wasn't added successfully to the database
    response.status(500).send({
      message: "Error creating user",
      error,
    });
  }
});

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      console.log(request.body.password)
      argon2
        .verify(user.password, request.body.password)

        // if the passwords match
        .then((passwordMatch) => {

          if (!passwordMatch) {
            return response.status(400).send({
              message: "Passwords do not match",
            });
          }
          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password do not match
        .catch((error) => {
          response.status(400).send({
            message: "Error comparing passwords",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// add a new endpoint to save password information
app.post("/savePassword", auth, async (request, response) => {
  const { name, url, password } = request.body;
  const userId = request.user.userId;

  const token = request.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, "RANDOM-TOKEN");
    const userIdFromToken = decodedToken.userId;

      const secret = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            secrets: {name, url, password}
          }
        },
        {new: true}
      );
      response.send(secret);
    }); 



app.post("/getPassword", auth, async (request, response) => {
  const { name } = request.body;
  const userId = request.user.userId;

  const token = request.headers.authorization.split(" ")[1];
  const user = await User.findById(userId);

  const secret = user.secrets.find(secret => secret.name === name);
  if (!secret) {
    return response.status(404).send("Secret not found");
  }

  response.send(secret);

});

const PORT = process.env.PORT || 8080;
  
app.listen(PORT, console.log(`Server started on port ${PORT}`));