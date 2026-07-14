const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // store users: {username, password}

const isValid = (username)=>{
  let userWithSameName = users.filter((user) => {
    return user.username === username;
  });
  return userWithSameName.length === 0; // true if username is new
}

const authenticatedUser = (username,password)=>{
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validUsers.length > 0;
}

// Task 6: Register a new user - stays at /register
regd_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username ||!password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if(!isValid(username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User registered successfully"});
});

// Task 7: Login - MUST be /customer/login
regd_users.post("/customer/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username ||!password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if(authenticatedUser(username,password)) {
    // Generate JWT token and save in session
    let accessToken = jwt.sign({data: username}, 'access', {expiresIn: 60 * 60});
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Task 8: Add/Modify a book review - MUST be /customer/auth/review/:isbn
regd_users.put("/customer/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if(!books) {
    return res.status(404).json({message: "Book not found"});
  }
  if(!review) {
    return res.status(400).json({message: "Review text is required"});
  }

  // Add or modify review. One review per user per ISBN
  books.reviews[username] = review;

  return res.status(200).json({message: "Review added/updated successfully"});
});

// Task 9: Delete a book review - MUST be /customer/auth/review/:isbn
regd_users.delete("/customer/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if(!books) {
    return res.status(404).json({message: "Book not found"});
  }

  // Check if this user has a review for this ISBN
  if(books.reviews[username]) {
    delete books.reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  } else {
    return res.status(404).json({message: "No review found for this user on this book"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;