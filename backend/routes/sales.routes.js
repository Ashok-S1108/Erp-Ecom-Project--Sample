const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

// GET /api/sales?range=daily|weekly|monthly
router.get('/', async (req, res) => {
  try {
    const range = req.query.range || 'weekly';
    let data = [];

    if (range === 'daily') {
      // Last 7 days
      const start = new Date();
      start.setDate(start.getDate() - 6);

      data = await Order.aggregate([
        { $match: { created_at: { $gte: start } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
            },
            amount: { $sum: "$total_amount" }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", amount: 1, _id: 0 } }
      ]);
    } else if (range === 'weekly') {
      // Last 6 weeks
      const start = new Date();
      start.setDate(start.getDate() - 42); // 6 weeks

      data = await Order.aggregate([
        { $match: { created_at: { $gte: start } } },
        {
          $group: {
            _id: { $week: "$created_at" },
            amount: { $sum: "$total_amount" }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { week: "$_id", amount: 1, _id: 0 } }
      ]);
    } else if (range === 'monthly') {
      // Last 6 months
      const start = new Date();
      start.setMonth(start.getMonth() - 5);

      data = await Order.aggregate([
        { $match: { created_at: { $gte: start } } },
        {
          $group: {
            _id: { $month: "$created_at" },
            amount: { $sum: "$total_amount" }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { month: "$_id", amount: 1, _id: 0 } }
      ]);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
