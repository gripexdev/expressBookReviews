const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send the books as a JSON response
    res.status(200).json(books); // Send books as JSON, no need to stringify
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Get ISBN from the request parameters

    // Check if the ISBN exists in the books database
    if (books[isbn]) {
        res.status(200).json(books[isbn]); // Send book details as a JSON response
    } else {
        res.status(404).json({message: "Book not found"}); // Return an error if book is not found
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
