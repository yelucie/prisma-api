var express = require("express");
var router = express.Router();
var { body, validationResult } = require("express-validator");
var api = require("../api/books");
var authorsApi = require("../api/authors");

/* GET list of books. */
router.get("/", async function (req, res, next) {
  await api.findAll().then((data) => {
    res.render("books", { title: "List of books", books: data });
  });
});

/* GET form to add a book. */
router.get("/add", async function (req, res, next) {
  await authorsApi.findAll().then((data) => {
    res.render("books_input", { title: "Add a new book", authors: data });
  });
});

/* POST form to add a book. */
router.post("/add",
  body("title").trim(),
  body("description").trim(),
  async function (req, res, next) {
    var newBook = {
      title: req.body.title,
      description: req.body.description,
    };

    await api.create(newBook).then(() => {
      res.redirect("/books");
    });
  }
);

/* GET a single book. */
router.get("/:uuid", async function (req, res, next) {
  await api.findById(req.params.uuid).then((data) => {
    var author = "N/A";
    var genres = [];

    // Check if the book has an author
    if(data.authors.length !== 0) {
      author = data.authors[0];
    }
    
    // Check if the book has genres
    if(data.genres.length !== 0) {
      genres = data.genres;
    }

    res.render("book", { title: `${data.title}`, book: data, author: author, genres: genres});
  });
});

/* DELETE book */
router.get("/:uuid/delete", async function (req, res, next) {
  await api.deleteById(req.params.uuid);
  res.redirect("/books");
});

/* GET book edit */
router.get("/:uuid/edit", async function (req, res, next) {
  await api.findById(req.params.uuid).then((data) => {
    res.render("books_input", { title: `${data.title}`, book: data });
  });
});

/* POST book edit */
router.post("/:uuid/edit",
  body("title").trim(),
  body("description").trim(),
  async function (req, res, next) {
  const updatedBook = {
    id: req.params.uuid,
    title: req.body.title,
    description: req.body.description
  };

  await api.update(updatedBook).then(() => {
    res.redirect("/books");
  });
});

module.exports = router;
