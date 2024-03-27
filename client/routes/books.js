var express = require("express");
var router = express.Router();
var api = require("../api/books");

/* GET list of books. */
router.get("/", async function (req, res, next) {
  await api.findAll().then((data) => {
    console.log(data);
    res.render("books", { title: "List of books", books: data });
  });
});

/* GET form to add a book. */
router.get("/add", function (req, res, next) {
  res.render("books_input", { title: "Add a new book" });
});

/* GET a single book. */
router.get("/:uuid", function (req, res, next) {
  const book = api.findById(req.params.uuid);

  if (book) {
    res.render("book", {
      title: `${book.title}`,
      book: book,
    });
  }
});

/* GET book delete */
router.get("/:uuid/delete", function (req, res, next) {
  repo.deleteById(req.params.uuid);
  res.redirect("/books");
});

/* GET book edit */
router.get("/:uuid/edit", function (req, res, next) {
  // const book = repo.findById(req.params.uuid);
  const book = {
    id: "1",
    title: "The Catcher in the Rye",
    description: "blabla",
  };

  if (book) {
    res.render("books_input", {
      title: `Edit ${book.title}`,
      book: book,
    });
  }
});

module.exports = router;
