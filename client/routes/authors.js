var express = require("express");
var router = express.Router();
var { body, validationResult } = require("express-validator");
var api = require("../api/authors");

/* GET list of authors. */
router.get("/", async function (req, res, next) {
  await api.findAll().then((data) => {
    res.render("authors", { title: "List of authors", authors: data });
  });
});

/* GET form to add an author. */
router.get("/add", function (req, res, next) {
  res.render("authors_input", { title: "Add a new author" });
});

/* POST form to add an author. */
router.post(
  "/add",
  body("firstname").trim(),
  body("lastname").trim(),
  body("country").trim(),
  function (req, res, next) {
    var newAuthor = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
    };

    api.create(newAuthor);
    res.redirect("/authors");
  }
);

/* GET a single author. */
router.get("/:uuid", async function (req, res, next) {
  await api.findById(req.params.uuid).then((data) => {
    res.render("author", {
      title: `${data.firstname} ${data.lastname}`,
      author: data,
    });
  });
});

/* DELETE author */
router.get("/:uuid/delete", async function (req, res, next) {
  await api.deleteById(req.params.uuid);
  res.redirect("/authors");
});

/* GET author edit */
router.get("/:uuid/edit", async function (req, res, next) {
  await api.findById(req.params.uuid).then((data) => {
    res.render("authors_input", {
      title: `${data.firstname} ${data.lastname}`,
      author: data,
    });
  });
});

/* POST contact edit */
router.post(
  "/:uuid/edit",
  body("firstname").trim(),
  body("lastname").trim(),
  body("country").trim(),
  async function (req, res, next) {
    const updatedAuthor = {
      id: req.params.uuid,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
    };

    await api.update(updatedAuthor);
    res.redirect("/authors");
  }
);

module.exports = router;
