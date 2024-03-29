var express = require('express');
var router = express.Router();

/* GET graphQL demo page. */
router.get('/', function(req, res, next) {
  res.render('graphql', { title: 'CRUD operations' });
});

module.exports = router;
