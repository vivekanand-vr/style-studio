const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const c = require('../controllers/outfitController');

const OCCASIONS = ['Casual', 'Work', 'Party', 'Formal', 'Sports', ''];
const SEASONS   = ['Summer', 'Winter', 'Spring', 'Fall', 'All Season', ''];

// ── Generate — must come BEFORE /:id routes ───────────────────────────────────
router.post(
  '/generate',
  body('occasion').optional().isIn(OCCASIONS),
  body('season').optional().isIn(SEASONS),
  body('count').optional().isInt({ min: 1, max: 20 }),
  validate,
  c.generateOutfit
);

// ── Bulk migration ─────────────────────────────────────────────────────────────
router.post('/bulk', c.bulkCreate);

// ── Standard CRUD ──────────────────────────────────────────────────────────────
router.get('/', c.getOutfits);
router.get('/:id', param('id').isMongoId(), validate, c.getOutfitById);
router.post(
  '/',
  body('name').trim().notEmpty().withMessage('name is required'),
  body('occasion').optional().isIn(OCCASIONS),
  body('season').optional().isIn(SEASONS),
  validate,
  c.createOutfit
);
router.patch('/:id', param('id').isMongoId(), validate, c.updateOutfit);
router.delete('/:id', param('id').isMongoId(), validate, c.deleteOutfit);

module.exports = router;
