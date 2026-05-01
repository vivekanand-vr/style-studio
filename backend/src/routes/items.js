const router = require('express').Router();
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const c = require('../controllers/itemController');

// Validation rules shared between create and update
const itemFields = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('brand').trim().notEmpty().withMessage('brand is required'),
  body('category')
    .isIn(['Topwear', 'Bottomwear', 'Footwear', 'Accessories'])
    .withMessage('Invalid category'),
  body('subcategory').trim().notEmpty().withMessage('subcategory is required'),
  body('price').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('price must be a positive number'),
  body('currency').optional().isIn(['INR', 'USD', 'EUR', 'GBP']),
  body('sourceLink').optional({ checkFalsy: true }).isURL().withMessage('sourceLink must be a valid URL'),
  body('image').optional({ checkFalsy: true }).isURL().withMessage('image must be a valid URL'),
];

// ── Import from URL — must come BEFORE /:id routes ───────────────────────────
router.post(
  '/import-url',
  body('url').isURL().withMessage('A valid url is required'),
  validate,
  c.importFromUrl
);

// ── AI text extraction (user pastes raw product page text) ───────────────────
router.post(
  '/extract-text',
  body('text').trim().notEmpty().withMessage('text is required'),
  validate,
  c.extractFromText
);

// ── Bulk migration (from localStorage) ───────────────────────────────────────
router.post('/bulk', c.bulkCreate);

// ── Standard CRUD ─────────────────────────────────────────────────────────────
router.get('/', c.getItems);
router.get('/:id', param('id').isMongoId(), validate, c.getItemById);
router.post('/', itemFields, validate, c.createItem);
router.patch('/:id', param('id').isMongoId(), validate, c.updateItem);
router.delete('/:id', param('id').isMongoId(), validate, c.deleteItem);

// ── Toggles ───────────────────────────────────────────────────────────────────
router.patch('/:id/toggle-purchased', param('id').isMongoId(), validate, c.togglePurchased);
router.patch('/:id/toggle-favorite', param('id').isMongoId(), validate, c.toggleFavorite);

module.exports = router;
