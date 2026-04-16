const express = require('express');
const router = express.Router();

const controller = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', controller.create);
router.get('/', controller.getAll);
router.delete('/:id', controller.remove);

module.exports = router;