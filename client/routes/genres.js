var express = require("express");
var router = express.Router();
var { body, validationResult } = require("express-validator");
var api = require("../api/genres");

/* GET list of genres. */
router.get("/", async function (req, res, next) {
  await api.findAll().then((data) => {
    res.render("genres", { title: "List of genres", genres: data });
  });
});

/* GET form to add an genre. */
router.get("/add", function (req, res, next) {
  res.render("genres_input", { title: "Add a new genre" });
});

/* POST form to add an genre. */
router.post(
  "/add",
  body("label").trim(),
  function (req, res, next) {
    var newGenre = {
      label: req.body.label
    };

    api.create(newGenre);
    res.redirect("/genres");
  }
);

/* GET a single genre. */
router.get("/:uuid", async function (req, res, next) {
  await api.findById(req.params.uuid).then((data) => {
    res.render("genre", {
      title: `${data.label}`,
      genre: data,
    });
  });
});

/* DELETE genre */
router.get("/:uuid/delete", async function (req, res, next) {
  await api.deleteById(req.params.uuid);
  res.redirect("/genres");
});

/* GET genre edit */
router.get("/:uuid/edit", async function (req, res, next) {
  await api.findById(req.params.uuid).then((data) => {
    res.render("genres_input", {
      title: `${data.label}`,
      genre: data,
    });
  });
});

/* POST contact edit */
router.post(
  "/:uuid/edit",
  body("label").trim(),
  async function (req, res, next) {
    const updatedAuthor = {
      id: req.params.uuid,
      label: req.body.label,
    };

    await api.update(updatedAuthor);
    res.redirect("/genres");
  }
);

module.exports = router;
