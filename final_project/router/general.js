const express = require('express');
const axios = require('axios'); // npm install axios - used for external API calls if needed
let books = require("./booksdb.js"); // Import books database
let isValid = require("./auth_users.js").isValid; // Import validation function
let users = require("./auth_users.js").users; // Import users array
const public_users = express.Router();

/*
 * Helper function: returns a Promise that resolves with books data
 * This is used with async/await in all public routes below
 */
let getBooks = () => {
  return new Promise((resolve, reject) => {
    if(books) {
      resolve(books); // If books exist, return the data
    } else {
      reject("No books available"); // If no books, reject the promise
    }
  });
}

/*
 * Task 10: Get the list of all books
 * Method: GET /
 * Uses async-await to wait for the Promise from getBooks()
 */
public_users.get('/', async function (req, res) {
  try {
    const bookData = await getBooks(); // Wait for books data
    return res.status(200).json(bookData); // Return all books as JSON
  } catch (error) {
    return res.status(500).json({message: error}); // Handle server error
  }
});

/*
 * Task 11: Get book details based on ISBN
 * Method: GET /isbn/:isbn
 * Uses async-await + Promise to fetch book by ISBN key
 */
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn; // Get ISBN from URL parameter
  try {
    const bookData = await getBooks(); // Wait for books data
    if(bookData[isbn]) {
      return res.status(200).json(bookData[isbn]); // Return book if found
    } else {
      return res.status(404).json({message: "Book not found"}); // Return 404 if not found
    }
  } catch (error) {
    return res.status(500).json({message: error}); // Handle server error
  }
});

/*
 * Task 12: Get book details based on Author
 * Method: GET /author/:author
 * Uses async-await + Promise. Filters all books to find matches by author name
 */
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author; // Get author name from URL parameter
  try {
    const bookData = await getBooks(); // Wait for books data
    let booksByAuthor = []; // Array to store books by this author

    // Loop through all books and check if author matches
    Object.keys(bookData).forEach((key) => {
      if(bookData[key].author === author) {
        booksByAuthor.push(bookData[key]); // Add matching book to array
      }
    });

    // If we found books, return them. Otherwise return 404
    if(booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({message: "No books found for this author"});
    }
  } catch (error) {
    return res.status(500).json({message: error}); // Handle server error
  }
});

/*
 * Task 13: Get all books based on Title
 * Method: GET /title/:title
 * Uses async-await + Promise. Filters all books to find matches by title
 */
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title; // Get title from URL parameter
  try {
    const bookData = await getBooks(); // Wait for books data
    let booksByTitle = []; // Array to store books with this title

    // Loop through all books and check if title matches
    Object.keys(bookData).forEach((key) => {
      if(bookData[key].title === title) {
        booksByTitle.push(bookData[key]); // Add matching book to array
      }
    });

    // If we found books, return them. Otherwise return 404
    if(booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    return res.status(500).json({message: error}); // Handle server error
  }
});

/*
 * Task 5: Get book review
 * Method: GET /review/:isbn
 * This route stays synchronous as per assignment requirements
 */
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Get ISBN from URL parameter
  if(books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 2)); // Return reviews object
  } else {
    res.status(404).json({message: "Book not found"}); // Return 404 if book doesn't exist
  }
});

module.exports.general = public_users; // Export router