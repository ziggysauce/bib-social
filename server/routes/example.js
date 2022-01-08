const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json({
    data: [{ num: 1 }, { num: 2 }, { num: 3 }],
  });
});

module.exports = router;
