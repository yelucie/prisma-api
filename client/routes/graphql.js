var express = require('express');
var router = express.Router();

/* GET graphQL page. */
router.get('/', function(req, res, next) {
  res.render('graphql', { title: 'GraphQL operations' });
});

module.exports = router;
