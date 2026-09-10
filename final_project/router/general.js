const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using Async/Await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/books_internal`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Helper route for internal Axios call
public_users.get('/books_internal', function (req, res) {
  return res.status(200).json(books);
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`${BASE_URL}/books_internal`)
    .then((response) => {
      const book = response.data[isbn];
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching book details", error: error.message });
    });
});

// Task 12: Get book details based on Author using Async/Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/books_internal`);
    const allBooks = response.data;
    const matchingBooks = Object.values(allBooks).filter(
      (b) => b.author.toLowerCase() === author.toLowerCase()
    );

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Get book details based on Title using Promises with Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`${BASE_URL}/books_internal`)
    .then((response) => {
      const allBooks = response.data;
      const matchingBooks = Object.values(allBooks).filter(
        (b) => b.title.toLowerCase() === title.toLowerCase()
      );

      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
