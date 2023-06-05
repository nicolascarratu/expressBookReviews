const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return users.find((user) => user.username === username) === undefined;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user !== undefined;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  const isAuthenticated = authenticatedUser(username, password);

  if (isAuthenticated) {
    // If user is found and password is right create a token
    const payload = {
      username: username,
    };
    var token = jwt.sign(payload, "fingerprint_customer", {
      expiresIn: "24h", // expires in 24 hours
    });
    // set the session user as the token
    req.session.user = {username, token};

    // return the JWT token for the future API calls
    res.status(200).json({
      success: true,
      message: "Authentication successful!",
      token: token,
    });
  } else {
    res.status(403).json({
      success: false,
      message: "Incorrect username or password",
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.user.username;
  const review = req.body;

  console.log(username)
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ success: false, message: "Book not found." });
  }

  // Add or update the user's review
  books[isbn].reviews[username] = review;
  console.log(books[isbn].reviews)

  // Respond with a success message
  res.json({ data: books[isbn].reviews[username] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.user.username;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ success: false, message: "Book not found." });
  }

  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res
      .status(404)
      .json({ success: false, message: "Review not found." });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  // Respond with a success message
  res.json({ success: true, message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.books = books;
