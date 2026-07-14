const express = require('express');
const axios = require('axios'); // npm install axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function: returns a Promise that resolves with books data
let getBooks = () => {
  return new Promise((resolve, reject) => {
    if(books) {
      resolve(books);
    } else {
      reject("No books available");
    }
  });
}

// Task 10: Get the list of books using async-await + Promise
public_users.get('/', async function (req, res) {
  try {
    const bookData = await getBooks();
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(500).json({message: error});
  }
});

// Task 11: Get book details based on ISBN using async-await + Promise
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const bookData = await getBooks();
    if(bookData[isbn]) {
      return res.status(200).json(bookData[isbn]);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
 });

// Task 12: Get book details based on Author using async-await + Promise
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const bookData = await getBooks();
    let booksByAuthor = [];
    Object.keys(bookData).forEach((key) => {
      if(bookData[key].author === author) {
        booksByAuthor.push(bookData[key]);
      }
    });
    if(booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({message: "No books found for this author"});
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
});

// Task 13: Get all books based on Title using async-await + Promise
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const bookData = await getBooks();
    let booksByTitle = [];
    Object.keys(bookData).forEach((key) => {
      if(bookData[key].title === title) {
        booksByTitle.push(bookData[key]);
      }
    });
    if(booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
});

// Task 5: Get book review - stays sync
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 2));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;