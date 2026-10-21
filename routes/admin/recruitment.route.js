const router = require('express').Router();
const controller = require('../../controllers/admin/recruitment.controller');

router.get('/', controller.list);
router.get('/list', controller.list);
router.patch('/delete/:id', controller.delete);
router.patch('/change-multi', controller.changeMulti);

module.exports = router;

