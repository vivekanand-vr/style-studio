const router = require('express').Router();

router.use('/items',   require('./items'));
router.use('/outfits', require('./outfits'));
router.use('/prices',  require('./prices'));

module.exports = router;
