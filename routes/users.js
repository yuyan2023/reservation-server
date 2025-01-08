var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', function(req, res) {
  res.json({
    data:[],
    code: 100,
  });
});

router.post('/create', function(req, res) {
  console.log(req.body);
  res.json({
    code: 1,
    data:'new data'
  });
});
module.exports = router;
