const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const axios = require('axios'); // Import axios
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(409).json({message: "Username already exists"});
    }

    // Add the new user to the users array
    const newUser = { username, password }; // In a real-world application, you'd hash the password before storing it
    users.push(newUser);

    // Return a success message
    res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('URL_TO_GET_BOOKS');
        const books = response.data;
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`URL_TO_GET_BOOK_BY_ISBN/${isbn}`); // Replace with the actual URL or API endpoint
        const book = response.data;
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase(); // Extract author from the request and make it lowercase for case-insensitive matching
    let booksByAuthor = [];

    // Iterate through the books object and find books by the specified author
    for (let key in books) {
        if (books[key].author.toLowerCase() === author) {
            booksByAuthor.push(books[key]); // If author matches, add the book to the result array
        }
    }

    // If books by the author are found, send them; otherwise, return an error message
    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor); // Send the books by the author as a JSON response
    } else {
        res.status(404).json({message: "No books found for this author"}); // No books found for the author
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase(); // Extract title from the request and make it lowercase for case-insensitive matching
    let booksByTitle = [];

    // Iterate through the books object and find books by the specified title
    for (let key in books) {
        if (books[key].title.toLowerCase() === title) {
            booksByTitle.push(books[key]); // If title matches, add the book to the result array
        }
    }

    // If books by the title are found, send them; otherwise, return an error message
    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle); // Send the books by the title as a JSON response
    } else {
        res.status(404).json({message: "No books found with this title"}); // No books found for the title
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from the request parameters

    // Check if the book exists in the books object
    if (books[isbn]) {
        // Check if the book has reviews
        if (Object.keys(books[isbn].reviews).length > 0) {
            res.status(200).json(books[isbn].reviews); // Send the reviews as a JSON response
        } else {
            res.status(404).json({message: "No reviews found for this book"}); // No reviews found for the book
        }
    } else {
        res.status(404).json({message: "Book not found"}); // Book not found
    }
});

module.exports.general = public_users;
