const express = require("express");
const app = express();
const bodyParser = require("body-parser");
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
// add a new endpoint to save password information
app.post("/savePassword", auth, async (request, response) => {
  const { name, userName, url, password } = request.body;
  const userId = request.user.userId;

  try {
    // find the user
    const user = await User.findById(userId);
    console.log(request.body)

    // check if the secret already exists
    const existingSecret = user.secrets.find(
      (secret) => secret.name === name && secret.url === url && secret.userName == userName
    );

    if (existingSecret) {
      // update the existing secret
      existingSecret.password = password;
      await user.save();

      response.send(existingSecret);
    } else {
      // add a new secret
      const newSecret = { name, userName, url, password };
      console.log(newSecret);
      user.secrets.push(newSecret);
      await user.save();

      console.log(response);
      response.send(newSecret);
    }
  } catch (error) {
    response.status(500).send({ message: "Internal Server Error" });
  }
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

app.get("/getAllPasswords", auth, async (request, response) => {
  const userId = request.user.userId;

  try {
    const user = await User.findById(userId);
    response.send(user.secrets);
    
  } catch (error) {
    response.status(500).send({ message: "Internal Server Error" });
  }
});

// change password endpoint
app.put("/changePassword", auth, async (request, response) => {
  const { hashedCurrentPassword, hashedNewPassword } = request.body;
  const userId = request.user.userId;
  console.log(userId);

  try {
    // find the user
    const user = await User.findById(userId);

    // compare the old password with the current password
    const isPasswordMatch = await argon2.verify(user.password, hashedCurrentPassword);
    if (!isPasswordMatch) {
      return response.status(400).send({ message: "Invalid password" });
    }
    console.log(user.id);
    if (user._id.toString() !== userId) {
      return response.status(401).send({ message: "Unauthorized" });
    }

    // hash the new password and update the user's password
    const hashedPassword = await argon2.hash(hashedNewPassword);
    user.password = hashedPassword;
    await user.save();

    response.send({ message: "Password changed successfully" });
  } catch (error) {
    response.status(500).send({ message: "Internal Server Error" });
  }
});

app.put("/reencryptPasswords", auth, async (request, response) => {
  const userId = request.user.userId;
  const secretsList = request.body;
  console.log(request.body);
  console.log(secretsList);

  try {
    // Find the user
    const user = await User.findById(userId);
    console.log(userId);

    // Loop through all the secrets
    for (let i = 0; i < secretsList.length; i++) {
      const secret = secretsList[i];

      // Find the corresponding secret in the request body
      const matchingSecret =  user.secrets.find(
        (s) => s.name === secret.name && s.url === secret.url && s.userName === secret.userName
      );

      if (matchingSecret) {
        // Update the password with the re-encrypted version
        matchingSecret.password = secret.password;
        console.log(matchingSecret.password);
        console.log(secret.password)
        
      }
    }
    // Save the updated user to the DB
    await user.save();

    response.send({ message: "Passwords re-encrypted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));