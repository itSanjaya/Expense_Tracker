const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    data: { status: 'ok' },
    meta: {},
    error: null,
  });
});

module.exports = router;