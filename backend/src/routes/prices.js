const router = require('express').Router();
const { param, body } = require('express-validator');
const validate = require('../middleware/validate');
const c = require('../controllers/priceController');

router.get('/:itemId', param('itemId').isMongoId(), validate, c.getPriceHistory);
router.post(
  '/check',
  body('itemId').isMongoId().withMessage('Valid itemId is required'),
  validate,
  c.triggerPriceCheck
);

module.exports = router;
