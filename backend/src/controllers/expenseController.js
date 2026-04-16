const service = require('../services/expenseService');

async function create(req, res, next) {
  try {
    const expense = await service.createExpense(req.user.id, req.body);

    res.json({
      data: expense,
      meta: {},
      error: null
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const { page, limit } = req.query;

    const expenses = await service.getExpenses(
      req.user.id,
      Number(page) || 1,
      Number(limit) || 10
    );

    res.json({
      data: expenses,
      meta: { page: Number(page) || 1 },
      error: null
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await service.deleteExpense(
      req.user.id,
      req.params.id
    );

    res.json({
      data: result,
      meta: {},
      error: null
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getAll,
  remove
};