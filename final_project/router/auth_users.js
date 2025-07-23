const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body; // Get username and password from the request body

    // Validate if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user exists and if the password matches
    const user = users.find(u => u.username === username && u.password === password); // Match both username and password
    
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create a JWT token with the username
    const token = jwt.sign({ username: user.username }, "fingerprint_customer", { expiresIn: '1h' });

    // Send the JWT token in the response
    res.status(200).json({ message: "Login successful", token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
