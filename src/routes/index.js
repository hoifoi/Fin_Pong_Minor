const express = require('express');
const router = express.Router();
// const middleware = require('../middlewares/index')

const flowRouter = require('./flowRouter')
const userRouter = require('../routes/userRouter');
const familyRouter = require('../routes/familyRouter');

router.use('/flow', flowRouter.router)
router.use('/users', userRouter.router);
router.use('/family', familyRouter.router);

module.exports = router;
