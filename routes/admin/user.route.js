const router = require('express').Router();

const userController = require("../../controllers/admin/user.controller");

router.get('/list', userController.list);
router.patch('/change-multi', userController.changeMulti);
router.patch('/delete/:id', userController.delete);

module.exports = router;