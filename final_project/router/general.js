const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  let {username, password} = req.body;

  if(!username || !password) {
    return res.status(400).json({message: "Username or password not provided"});
  }

  if(!isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({username, password});
  
  return res.status(200).json(users);
});


// Get the book list available in the shop
public_users.get("/", function (req, res) {
  Promise.resolve(books)
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = books[req.params.isbn];
  console.log(isbn);
  return res.status(300).json(isbn);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let authors = [];
  for (const key in books) {
    if (books[key].author == req.params.author) {
      authors.push(books[key]);
    }
  }
  Promise.resolve(authors)
    .then((authors) => res.status(200).json({message: authors}))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = "";
  for (const key in books) {
    if (books[key].title == req.params.title) {
      title = books[key];
    }
  }
  Promise.resolve(title)
    .then((title) => res.status(200).json({message: title}))
    .catch((err) => res.status(500).json({ message: err.message }));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let review = books[req.params.isbn].reviews;
  return res.status(300).json({ message: review });
});

module.exports.general = public_users;
