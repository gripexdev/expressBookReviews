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
    const isbn = req.params.isbn; // Extract ISBN from the request
    const review = req.query.review; // Extract review text from the query
    const username = req.user.username; // Get the logged-in user's username from the session (JWT)

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // If the user has already posted a review for this book, modify the review
    if (books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review; // Modify the existing review
        res.status(200).json({ message: "Review updated successfully" });
    } else {
        // If the user hasn't posted a review, add a new review
        books[isbn].reviews[username] = review; // Add the new review
        res.status(201).json({ message: "Review added successfully" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from the request
    const username = req.user.username; // Get the logged-in user's username from the session (JWT)

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the logged-in user has posted a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(403).json({ message: "You can only delete your own review" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    // Send a success response
    res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
